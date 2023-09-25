/* Fullscreen */
let elem = document.documentElement;

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

function theme() {
  if (
    localStorage.getItem("theme") == null ||
    localStorage.getItem("theme") == "original"
  ) {
    localStorage.setItem("theme", "test");
    $("#playingcss-test").attr("rel", "stylesheet");
  } else {
    localStorage.setItem("theme", "original");
    $("#playingcss-test").attr("rel", "stylesheet alternate");
  }
}

if (localStorage.getItem("theme") == "test") {
  $("#playingcss-test").attr("rel", "stylesheet");
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

function setInformations(response) {
  titleSong = response.name;
  artistSong = response.artist.name;
  albumSong = response.album["#text"];
  title = "%title% by %artist%"
    .replace("%title%", titleSong)
    .replace("%artist%", artistSong);
  if (title === actual) {
    return;
  }
  actual = title;
  albumPicture = response.image[3]["#text"];
  let defBg = false;
  if (!albumPicture.length) {
    albumPicture = response.artist.image[3]["#text"];
  }
  if (
    albumPicture ===
    "https://lastfm.freetls.fastly.net/i/u/300x300/2a96cbd8b46e442fc41c2b86b821562f.png"
  ) {
    albumPicture = "/images/no_song.png";
    defBg = true;
  }
  albumPicture = albumPicture.replace("300x300", "2000x2000");

  let img = new Image();
  img.src = albumPicture;
  $(img).on("load", function () {
    $("#playing-div img").attr("src", albumPicture);
    $("#img-wrapper").attr("style", "display:block;");
    if (defBg) {
      $("#img-wrapper").attr("style", "display:none;");
    }
    $("#background-image-div").attr(
      "style",
      "background: rgb(34,0,77); background: radial-gradient(circle, rgba(34,0,77,1) 0%, rgba(0,0,0,1) 100%);"
    );
    if (!defBg) {
      $("#background-image-div").attr(
        "style",
        "background: url('" +
          albumPicture +
          "');background-size:cover;background-position: center center;"
      );
    }
  });
  $("#song-title").text(titleSong);
  $("#song-artist").text(artistSong);
  $("#song-album").text(albumSong);
  document.title = title;
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
