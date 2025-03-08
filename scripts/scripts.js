function changeUser() {
  let newUser;
  let prompted;
  while (!newUser) {
    prompted = prompt("Enter a valid Last.fm user please:");
    if (prompted) {
      newUser = prompted.trim();
    } else {
      newUser = localStorage.getItem("user");
    }
  }
  localStorage.setItem("user", newUser);
}

/* View in fullscreen */
function openFullscreen() {
  const elem = document.documentElement;
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

function toggleFullscreen() {
  const isFullscreen = document.fullscreen;
  isFullscreen ? closeFullscreen() : openFullscreen();
}

function setBlur(value = 1) {
  const backgroundElement = document.getElementById("background-image-div");
  const possibleValues = [0, 1, 2];
  
  delete possibleValues[value];
  localStorage.setItem("blur", value.toString());
  
  backgroundElement.classList.add(`background-image-div-${value}`);
  possibleValues.forEach(number => {
    backgroundElement.classList.remove(`background-image-div-${number}`);
  });
}

function toggleBlur() {
  const currentBlur = parseInt(localStorage.getItem("blur"));
  
  if (currentBlur === 0) {
    setBlur(1);
    return;
  }

  if (!currentBlur || currentBlur === 1) {
    setBlur(2);
    return;
  }

  if (currentBlur === 2) {
    setBlur(0);
    return;
  }
}

function setBlurDef(value = 1) {
  const el = document.getElementById("background-image-Def-div");
  let numbers = [0, 1, 2];
  delete numbers[value];
  localStorage.setItem("blurDef", value.toString());
  el.classList.add("background-image-div-" + value);
  numbers.forEach((number) => {
    el.classList.remove("background-image-div-" + number);
  });
}
setBlurDef(parseInt(localStorage.getItem("blurDef") || "1"));

function blurrDef() {
  const blur = localStorage.getItem("blurDef");
  console.log(blur);
  if (blur == null || blur === "1" || blur === 1 || blur === "NaN") {
    setBlurDef(2);
    return;
  }
  if (blur === "2" || blur === 2) {
    setBlurDef(0);
    return;
  }
  if (blur === "0" || blur === 0) {
    setBlurDef(1);
    return;
  }
}

function showDefBg(show) {
  const el = document.getElementById("background-image-Def-div");
  if (show) {
    el.classList.remove('hidden')
  } else {
    el.classList.add('hidden')
  }
}
showDefBg(false)

function defBgCheck() {
  const defBgBlob = localStorage.getItem("backgroundImg");
  if (defBgBlob) {
    $("#background-image-Def-div").attr(
      "style",
      genBgStyle(defBgBlob)
    );
  }
  const defBg = localStorage.getItem("backgroundImgAlways") === "1";
  if (defBg) {
    showDefBg(true)
  } else {

    showDefBg(false)
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
  albumPicFilename = albumPicture.split('/').pop();
  let noPic = false;
  if (albumPicFilename === "2a96cbd8b46e442fc41c2b86b821562f.png") {
    noPic = true
  };
  let brightness = 0;
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
    showDefBg(false);
  } else {
    const defBgBlob = localStorage.getItem("backgroundImg");
    $("#background-image-Def-div").attr(
      "style",
      genBgStyle(defBgBlob)
    );
    showDefBg(true)
  }
  $("#song-title").text(titleSong);
  $("#song-artist").text(artistSong);
  $("#song-album").text(albumSong);
  document.title = title;
  
  // Get release year from Discogs
  fetch(`https://api.discogs.com/database/search?artist=${encodeURIComponent(artistSong)}&release_title=${encodeURIComponent(albumSong)}&key=SYHPUeMqGHMYLlbSHJqd&secret=OiyqPOhZUgMKUwFDuxvQvfKPDAXqJFtF&per_page=10&page=1`)
    .then(response => response.json())
    .then(data => {
      if (data.results && data.results.length > 0) {
        // Find earliest release year
        const earliestYear = data.results.reduce((earliest, result) => {
          const year = parseInt(result.year);
          if (!isNaN(year) && (!earliest || year < earliest)) {
            return year;
          }
          return earliest;
        }, null);
        
        if (earliestYear) {
          $("#song-year").text(earliestYear);
        }
      }
    })
    .catch(error => console.log('Error fetching Discogs data:', error));

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
function backgroundInputUrl(url = null) {
  let prompted = "";
  if (url) {
    prompted = url;
  } else {
    prompted = prompt("Enter a valid image URL:");
  }
  readBackground(prompted);
  return;
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
  const actual = localStorage.getItem("contrast");
  console.log(actual);
  if (actual === "0") {
    localStorage.setItem("contrast", "1");
    contrastdiv.classList.add("darken");
  } else {
    localStorage.setItem("contrast", "0");
    contrastdiv.classList.remove("darken");
  }

}

function contrastCheck() {
  const actual = localStorage.getItem("contrast");
  const contrastdiv = document.getElementById("contrast");
  if (actual === null) {
    localStorage.setItem("contrast", "1");
    contrastdiv.classList.add("darken");
    return
  }
  if (actual === "0") {
    contrastdiv.classList.remove("darken");
  } else {
    contrastdiv.classList.add("darken");
  }
}
contrastCheck();

function toggleContrastDef() {
  const contrastdiv = document.getElementById("contrastDef");
  const actual = localStorage.getItem("contrastDef");
  console.log(actual);
  if (actual === "0") {
    localStorage.setItem("contrastDef", "1");
    contrastdiv.classList.add("darken");
  } else {
    localStorage.setItem("contrastDef", "0");
    contrastdiv.classList.remove("darken");
  }

}

function contrastDefCheck() {
  const actual = localStorage.getItem("contrastDef");
  const contrastdiv = document.getElementById("contrastDef");
  if (actual === null) {
    localStorage.setItem("contrastDef", "1");
    contrastdiv.classList.add("darken");
    return
  }
  if (actual === "0") {
    contrastdiv.classList.remove("darken");
  } else {
    contrastdiv.classList.add("darken");
  }
}

function toggleAnimation() {
  const div = document.getElementById("bgwrapper");
  const actual = localStorage.getItem("animation");
  console.log(actual);
  if (actual === "0") {
    localStorage.setItem("animation", "1");
    div.classList.add("animation");
  } else {
    localStorage.setItem("animation", "0");
    div.classList.remove("animation");
  }

}

function animationCheck() {
  const actual = localStorage.getItem("animation");
  const div = document.getElementById("bgwrapper");
  if (actual === null) {
    localStorage.setItem("animation", "0");
    div.classList.remove("animation");
    return
  }
  if (actual === "0") {
    div.classList.remove("animation");
  } else {
    div.classList.add("animation");
  }
}

function toggleAnimationDef() {
  const div = document.getElementById("bgwrapperDef");
  const actual = localStorage.getItem("animationDef");
  console.log(actual);
  if (actual === "0") {
    localStorage.setItem("animationDef", "1");
    div.classList.add("animation");
  } else {
    localStorage.setItem("animationDef", "0");
    div.classList.remove("animation");
  }

}

function animationDefCheck() {
  const actual = localStorage.getItem("animationDef");
  const div = document.getElementById("bgwrapperDef");
  if (actual === null) {
    localStorage.setItem("animationDef", "1");
    div.classList.add("animation");
    return
  }
  if (actual === "0") {
    div.classList.remove("animation");
  } else {
    div.classList.add("animation");
  }
}

setBlur(parseInt(localStorage.getItem("blur") || "1"));

contrastDefCheck();
contrastDefCheck();
animationCheck();
animationDefCheck();
