var currentLang = "TR";

const translations = {
  TR: {
    title: "TA-Tuner Controller",
    left: "SOL",
    right: "SAĞ",
    stop: "DUR",
    ota: "Yazılım Güncelleme",
    selectFile: "📂 Dosya Seç...",
    noFile: "Henüz dosya seçilmedi",
    updateBtn: "Güncelle",
    closeBtn: "Kapat",
    updateSuccess: "Güncelleme Başarılı! Cihaz yeniden başlatılıyor...",
    updateFail: "Hata! Yükleme başarısız.",
    alertSelect: "Lütfen bir dosya seçin!"
  },
  EN: {
    title: "TA-Tuner Controller",
    left: "LEFT",
    right: "RIGHT",
    stop: "STOP",
    ota: "Firmware Update",
    selectFile: "📂 Select File...",
    noFile: "No file has been selected yet",
    updateBtn: "Update",
    closeBtn: "Close",
    updateSuccess: "Update Successful! Device restarting...",
    updateFail: "Error! Failed to load.",
    alertSelect: "Please select a file!"
  }
};

function setLanguage(lang) {
  currentLang = lang;
  const t = translations[lang];

  document.title = t.title;
  document.querySelector(".left-panel h2").innerText = t.left;
  document.querySelector(".right-panel h2").innerText = t.right;
  document.querySelector(".btn-stop").innerText = t.stop;
  document.querySelector(".ota-box h3").innerText = t.ota;
  document.querySelector(".btn-file").innerText = t.selectFile;
  document.querySelector("#otaModal .btn-primary").innerText = t.updateBtn;
  document.querySelector("#otaModal .btn-close").innerText = t.closeBtn;
  document.querySelector(".lang-toggle").innerText = (lang === "TR" ? "TR | EN" : "EN | TR");
}

function toggleLang() {
  const newLang = currentLang === "TR" ? "EN" : "TR";
  setLanguage(newLang);
  fetch('/setLang?lang=' + newLang).catch(console.error);
}

fetch('/getLang')
  .then(res => res.text())
  .then(lang => {
    if (lang === "TR" || lang === "EN") {
      setLanguage(lang);
    } else {
      setLanguage("TR");
    }
  })
  .catch(err => {
    console.error("Failed to get language", err);
    setLanguage("TR");
  });

function moveMotorDeg(deg) {
  fetch(`/move?deg=${deg * -1}`)
    .then(response => {
      if (response.ok) {
        console.log("Moved " + deg);
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
  const posDisplay = document.getElementById('posDisplay');
  const posSpan = document.getElementById('position');

  fetch('/position')
    .then(response => {
      if (!response.ok) throw new Error("Network response was not ok");
      return response.text();
    })
    .then(data => {
      if (data.trim().startsWith("<") || isNaN(parseFloat(data))) {
        posSpan.innerText = "--";
        posDisplay.classList.remove("connected");
        posDisplay.classList.add("disconnected");
      } else {
        posSpan.innerText = data;
        posDisplay.classList.add("connected");
        posDisplay.classList.remove("disconnected");
      }
    })
    .catch(err => {
      posSpan.innerText = "--";
      posDisplay.classList.remove("connected");
      posDisplay.classList.add("disconnected");
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
  const t = translations[currentLang];

  if (!file) {
    alert(t.alertSelect);
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
      document.getElementById("upload_status").innerText = t.updateSuccess;
      document.getElementById("upload_status").style.color = "#3fb950";
    } else {
      document.getElementById("upload_status").innerText = t.updateFail;
      document.getElementById("upload_status").style.color = "#ff7b72";
    }
  };

  xhr.send(formData);
}

function updateFileName() {
  var input = document.getElementById('file_input');
  var display = document.getElementById('file_name_display');
  const t = translations[currentLang];

  if (input.files & input.files.length > 0) {
    display.innerText = input.files[0].name;
    display.style.color = "#3fb950";
  } else {
    display.innerText = t.noFile;
    display.style.color = "#aaa";
  }
}