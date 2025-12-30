#include <WiFi.h>
#include <WebServer.h>
#include <Update.h>
#include <LittleFS.h>
#include <AccelStepper.h>

const char* ssid = "TA-Tuner-Controller";
const char* password = "deeplabstudio";

#define MOTOR_PIN_1 19
#define MOTOR_PIN_2 18
#define MOTOR_PIN_3 5
#define MOTOR_PIN_4 17

#define MotorInterfaceType 8

AccelStepper stepper(MotorInterfaceType, MOTOR_PIN_1, MOTOR_PIN_3, MOTOR_PIN_2, MOTOR_PIN_4);

WebServer server(80);

String getContentType(String filename) {
  if (server.hasArg("download")) return "application/octet-stream";
  else if (filename.endsWith(".htm")) return "text/html";
  else if (filename.endsWith(".html")) return "text/html";
  else if (filename.endsWith(".css")) return "text/css";
  else if (filename.endsWith(".js")) return "application/javascript";
  else if (filename.endsWith(".png")) return "image/png";
  else if (filename.endsWith(".gif")) return "image/gif";
  else if (filename.endsWith(".jpg")) return "image/jpeg";
  return "text/plain";
}

bool handleFileRead(String path) {
  if (path.endsWith("/")) path += "index.html";
  if (LittleFS.exists(path)) {
    File file = LittleFS.open(path, "r");
    String contentType = getContentType(path);
    server.streamFile(file, contentType);
    file.close();
    return true;
  }
  return false;
}

void handleMove() {
  if (server.hasArg("steps")) {
    int steps = server.arg("steps").toInt();
    stepper.move(steps);
    server.send(200, "text/plain", "OK");
  } else {
    server.send(400, "text/plain", "Missing steps argument");
  }
}

void handleStop() {
  stepper.stop();
  server.send(200, "text/plain", "STOPPED");
}

void handlePosition() {
  String pos = String(stepper.currentPosition());
  server.send(200, "text/plain", pos);
}

const char update_html[] PROGMEM = R"rawliteral(
<!DOCTYPE html><html><body>
<h2>Offline Firmware Update</h2>
<form method='POST' action='/update' enctype='multipart/form-data'>
<input type='file' name='update'><input type='submit' value='Update'>
</form></body></html>)rawliteral";

void setup() {
  Serial.begin(115200);
  stepper.setMaxSpeed(1000.0);
  stepper.setAcceleration(500.0);

  if(!LittleFS.begin(true)){
    Serial.println("LittleFS Mount Error");
    return;
  }

  WiFi.softAP(ssid, password);
  Serial.print("AP IP: "); Serial.println(WiFi.softAPIP());

  server.on("/move", HTTP_GET, handleMove);
  server.on("/stop", HTTP_GET, handleStop);
  server.on("/position", HTTP_GET, handlePosition);

  server.on("/update", HTTP_GET, []() {
    server.send(200, "text/html", update_html);
  });
  server.on("/update", HTTP_POST, []() {
    server.send(200, "text/plain", (Update.hasError()) ? "FAIL" : "OK, Rebooting...");
    ESP.restart();
  }, []() {
    HTTPUpload& upload = server.upload();
    if (upload.status == UPLOAD_FILE_START) {
      if (!Update.begin(UPDATE_SIZE_UNKNOWN)) Update.printError(Serial);
    } else if (upload.status == UPLOAD_FILE_WRITE) {
      if (Update.write(upload.buf, upload.currentSize) != upload.currentSize) Update.printError(Serial);
    } else if (upload.status == UPLOAD_FILE_END) {
      if (Update.end(true)) Serial.println("OTA Done"); else Update.printError(Serial);
    }
  });

  server.onNotFound([]() {
    if (!handleFileRead(server.uri())) {
      server.send(404, "text/plain", "404 Not Found");
    }
  });

  server.begin();
}

void loop() {
  server.handleClient();
  stepper.run();
}