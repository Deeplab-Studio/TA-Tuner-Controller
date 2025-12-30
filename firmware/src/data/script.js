function moveMotor(steps) {
  fetch('/move?steps=' + steps)
    .then(response => {
      if (response.ok) {
        console.log("Moved " + steps);
      }
    })
    .catch(err => console.error(err));
}

function stopMotor() {
  fetch('/stop')
    .then(response => {
      console.log("Stopped");
    })
    .catch(err => console.error(err));
}

function updateStatus() {
  fetch('/position')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(data => {
      if (data.trim().startsWith("<") || isNaN(parseFloat(data))) {
        document.getElementById('position').innerText = "--";
        document.getElementById('connectionStatus').innerText = "No Connection";
        document.getElementById('connectionStatus').style.color = "#ff7b72";
      } else {
        document.getElementById('position').innerText = data;
        document.getElementById('connectionStatus').innerText = "Connected";
        document.getElementById('connectionStatus').style.color = "#3fb950";
      }
    })
    .catch(err => {
      document.getElementById('connectionStatus').innerText = "No Connection";
      document.getElementById('connectionStatus').style.color = "#ff7b72";
      document.getElementById('position').innerText = "--";
    });
}

setInterval(updateStatus, 500);

function toggleOTA() {
  var modal = document.getElementById("otaModal");
  modal.classList.toggle("show");
}

function uploadFile() {
  var fileInput = document.getElementById("file_input");
  var file = fileInput.files[0];
  if (!file) {
    alert("Please select a file!");
    return;
  }

  var formData = new FormData();
  formData.append("update", file);

  var xhr = new XMLHttpRequest();
  xhr.open("POST", "/update", true);

  xhr.upload.onprogress = function (e) {
    if (e.lengthComputable) {
      var percentComplete = (e.loaded / e.total) * 100;
      var bar = document.getElementById("progress_bar");
      var container = document.getElementById("progress_bar_container");
      container.style.display = "block";
      bar.style.width = percentComplete + "%";
      bar.innerText = Math.round(percentComplete) + "%";
    }
  };

  xhr.onload = function () {
    if (xhr.status === 200) {
      document.getElementById("upload_status").innerText = "Update Successful! Device restarting...";
      document.getElementById("upload_status").style.color = "#3fb950";
    } else {
      document.getElementById("upload_status").innerText = "Error! Failed to load.";
      document.getElementById("upload_status").style.color = "#ff7b72";
    }
  };

  xhr.send(formData);
}

function updateFileName() {
  var input = document.getElementById('file_input');
  var display = document.getElementById('file_name_display');
  if (input.files & input.files.length > 0) {
    display.innerText = input.files[0].name;
    display.style.color = "#3fb950";
  } else {
    display.innerText = "No file has been selected yet";
    display.style.color = "#aaa";
  }
}