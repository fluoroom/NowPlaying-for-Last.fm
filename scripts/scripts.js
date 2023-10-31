function changeUser() {
  let newUser;
  let prompted;
  while (!newUser) {
    prompted = prompt("Enter a valid Last.fm user please:");
    if (prompted) {
      prompted = prompted.trim();
      newUser = prompted;
    } else {
      const actualUser = localStorage.getItem("user");
      newUser = actualUser;
    }
  }
  localStorage.setItem("user", newUser);
}

/* View in fullscreen */
function openFullscreen() {
  let elem = document.documentElement;
  if (elem.requestFullscreen) {
    elem.requestFullscreen();
  } else if (elem.mozRequestFullScreen) {
    /* Firefox */
    elem.mozRequestFullScreen();
  } else if (elem.webkitRequestFullscreen) {
    /* Chrome, Safari and Opera */
    elem.webkitRequestFullscreen();
  } else if (elem.msRequestFullscreen) {
    /* IE/Edge */
    elem.msRequestFullscreen();
  }
}

/* Close fullscreen */
function closeFullscreen() {
  if (document.exitFullscreen) {
    document.exitFullscreen();
  } else if (document.mozCancelFullScreen) {
    /* Firefox */
    document.mozCancelFullScreen();
  } else if (document.webkitExitFullscreen) {
    /* Chrome, Safari and Opera */
    document.webkitExitFullscreen();
  } else if (document.msExitFullscreen) {
    /* IE/Edge */
    document.msExitFullscreen();
  }
}

function fullscreen() {
  let isFullscreen = document.fullscreen;
  if (isFullscreen == true) {
    closeFullscreen();
  } else {
    openFullscreen();
  }
}

function setBlur(value = 1) {
  const el = document.getElementById("background-image-div");
  let numbers = [0, 1, 2];
  delete numbers[value];
  localStorage.setItem("blur", value.toString());
  el.classList.add("background-image-div-" + value);
  numbers.forEach((number) => {
    el.classList.remove("background-image-div-" + number);
  });
}
setBlur(parseInt(localStorage.getItem("blur") || "1"));

function blurr() {
  const blur = localStorage.getItem("blur");
  console.log(blur);
  if (blur == null || blur === "1" || blur === 1 || blur === "NaN") {
    setBlur(2);
    return;
  }
  if (blur === "2" || blur === 2) {
    setBlur(0);
    return;
  }
  if (blur === "0" || blur === 0) {
    setBlur(1);
    return;
  }
}

const urlParams = new URLSearchParams(window.location.search);
const urlUser = urlParams.get("u");
if (urlUser) {
  if (!localStorage.getItem("user")) {
    localStorage.setItem("user", urlUser);
  }
  if (!(localStorage.getItem("user") === urlUser)) {
    if (confirm("Change user to " + urlUser + "?")) {
      localStorage.setItem("user", urlUser);
    }
  }
}
if (!localStorage.getItem("user")) {
  changeUser();
}

let actual = "";
let needRefresh = 0;

function genBgStyle(string) {
  return (
    "background: url(" +
    string +
    ");background-size: cover;background-position: center center;"
  );
}

let imgBrightness = 255;
function setInformations(response) {
  titleSong = response.name;
  artistSong = response.artist.name;
  albumSong = response.album["#text"];
  title = "%title% by %artist%"
    .replace("%title%", titleSong)
    .replace("%artist%", artistSong);
  if (title === actual && needRefresh === 0) {
    return;
  }
  actual = title;
  albumPicture = response.image[3]["#text"];
  let brightness = 0;
  let noPic = false;
  const defBg = localStorage.getItem("backgroundImgAlways") === "1";
  if (
    !albumPicture
  ) {
    albumPicture = "/images/no_song.png";
    noPic = true;
  }
  albumPicture = albumPicture.replace("300x300", "2000x2000");

  if (noPic) {
    $("#img-wrapper").attr("style", "display:none;");
  } else {
    $("#playing-div img").attr("src", albumPicture);
    $("#img-wrapper").attr("style", "display:block;");
  }
  if (!defBg && !noPic) {
    $("#background-image-div").attr(
      "style",
      genBgStyle("'" + albumPicture + "'")
    );
  } else {
    const defBgBlob = localStorage.getItem("backgroundImg");
    $("#background-image-div").attr(
      "style",
      genBgStyle(defBgBlob)
    );
  }
  $("#song-title").text(titleSong);
  $("#song-artist").text(artistSong);
  $("#song-album").text(albumSong);
  document.title = title;
  needRefresh = 0;
}

async function dataCheck() {
  const apiKey = "f366cdff626d6631ecb68fd5398e150c";
  const userName = localStorage.getItem("user");
  if (!userName) {
    return;
  }
  axios
    .get(
      `https://ws.audioscrobbler.com/2.0/?method=user.getRecentTracks&user=${userName}&api_key=${apiKey}&format=json&limit=1&nowplaying=true&extended=true`
    )
    .then((data) => {
      console.log(data.data.recenttracks.track[0]);
      setInformations(data.data.recenttracks.track[0]);
    });
}

setInterval(async function () {
  dataCheck();
}, 3000);

function changeBackrgound(value = 1) {
  const el = document.getElementById("background-image-div");
  let numbers = [0, 1, 2];
  delete numbers[value];
  localStorage.setItem("blur", value.toString());
  el.classList.add("background-image-div-" + value);
  numbers.forEach((number) => {
    el.classList.remove("background-image-div-" + number);
  });
}

function backgroundIcon() {
  icon = document.getElementById("bgfileinput");
  icon.click();
}

function backgroundInput() {
  const input = document.getElementById("bgfileinput");
  const file = input.files[0];
  let reader = new FileReader();
  reader.addEventListener("load", function () {
    readBackground(reader.result);
  });
  reader.readAsDataURL(file);
}
function backgroundInputUrl() {
  const prompted = prompt("Enter a valid image URL:");

  axios.get(prompted, {
    responseType: "blob"
  }).then((res) => {
    console.log(res.data)
    const file = res.data;
    let reader = new FileReader();
    reader.addEventListener("load", function () {
      readBackground(reader.result);
    });
    reader.readAsDataURL(file);
  });

}

function readBackground(blob) {
  console.log(blob)
  actual = localStorage.getItem("backgroundImg");
  if (actual) {
    if (!confirm("Do you want to change the default background?")) {
      return;
    }
  }
  localStorage.setItem("backgroundImg", blob);
  needRefresh = 1;
  dataCheck();
}

function toggleDefBgAlways() {
  const actual = localStorage.getItem("backgroundImgAlways");
  console.log(actual);
  if (actual === "0") {
    localStorage.setItem("backgroundImgAlways", "1");
  } else {
    localStorage.setItem("backgroundImgAlways", "0");
  }
  needRefresh = 1;
  dataCheck();
}

function toggleContrast() {
  const contrastdiv = document.getElementById("contrast");
  contrastdiv.classList.toggle("darken");
}
