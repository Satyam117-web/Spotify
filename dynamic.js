console.log("Hello guy sto my Spotify!!!")
let currentSong = new Audio();
let songs;
let currFolder;

function secondsToMinutes(seconds) {
  if (isNaN(seconds) || seconds < 0) {
    return "00:00"
  }
  // Calculate the minutes and remaining seconds
  const minutesPart = Math.floor(seconds / 60);
  const secondsPart = Math.floor(seconds % 60);

  // Format minutes and seconds to be 2 digits
  const formattedMinutes = String(minutesPart).padStart(2, '0');
  const formattedSeconds = String(secondsPart).padStart(2, '0');

  // Return in MM:SS format
  return `${formattedMinutes}:${formattedSeconds}`;
}
async function getSong(folder) {
  currFolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`)
  let response = await a.text()
  let div = document.createElement("div")
  div.innerHTML = response
  let as = div.getElementsByTagName("a")
  songs = []
  for (let i = 0; i < as.length; i++) {
    const element = as[i];
    if (element.href.endsWith(".mp3"))
      songs.push(element.href.split(`/${folder}/`)[1])
  }

  // Showing the list of songs int he library
  let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
  songUL.innerHTML= ""
  for (const song of songs) {
    songUL.innerHTML = songUL.innerHTML + `<li>  
      
                          <img class="invert" src="music.svg" alt="">
                          <div class="info">
                              <div> ${song.replaceAll("%20", " ")}</div>
                              <div>Travis Scot</div>
                          </div>
                          <div class="playnow"> 
                              <span>Play Now</span>
                          <img class="invert" src="play.svg" alt="">
                          </div></li>`;
  }

  //Attaching a song to the spotify 
  Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach(e => {
    e.addEventListener("click", element => {
      console.log(e.querySelector(".info").firstElementChild.innerHTML)
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
    })
  })
 return songs
}

const playMusic = (track, pause = false) => {
  currentSong.src = `/${currFolder}/` + track;
  if (!pause) {

    currentSong.play();
    play.src = "pause.svg"
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track)
  document.querySelector(".songtime").innerHTML = "00:00/00:00"

}

async function displayAlbums() {
let a = await fetch(`http://127.0.0.1:3000/Song/`)
let response = await a.text()
let div = document.createElement("div")
div.innerHTML = response
let anchors = div.getElementsByTagName("a")
let cardContainer = document.querySelector(".cardContainer")
let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    
  if(e.href.includes("/Song")){
    let folder = (e.href.split("/").slice(-2)[0])
    //Get the metadata of the folder
    let a = await fetch(`http://127.0.0.1:3000/Song/${folder}/info.json`)
    let response = await a.json()
    cardContainer.innerHTML= cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
                        <div class="play">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"
                                xmlns="http://www.w3.org/2000/svg">
                                <path d="M5 20V4L19 12L5 20Z" stroke="#141B34" fill="#000000" stroke-width="1.5"
                                    stroke-linejoin="round" />
                            </svg>
                        </div>

                        <img src="/Song/${folder}/cover.jpeg" alt="" />
                        <h2>${response.title}</h2>
                        <p>${response.description}</p>
                    </div>`
  }
}
// load the playlist whenever the album is clicked
Array.from(document.getElementsByClassName("card")).forEach(e => {
  // console.log(e)
  e.addEventListener("click", async item => {
    songs = await getSong(`Song/${item.currentTarget.dataset.folder}`)
  })
});
}

async function main() {

  // getting song
  await getSong("Song/first")
  playMusic(songs[0], true)

  // Display all the albums on the page
  displayAlbums()
  // Attaching play pause and next to the song 
  play.addEventListener("click", () => {
    if (currentSong.paused) {
      currentSong.play();
      play.src = "pause.svg"
    }
    else {
      currentSong.pause();
      play.src = "play.svg"
    }
  })

  // Listens the timeduration of the song 
  currentSong.addEventListener("timeupdate", () => {
    // console.log(currentSong.currentTime,currentSong.duration)
    document.querySelector(".songtime").innerHTML = `
        ${secondsToMinutes(currentSong.currentTime)}/
        ${secondsToMinutes(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
  })

  document.querySelector(".seekbar").addEventListener("click", e => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
    document.querySelector(".circle").style.left = percent + "%";
    currentSong.currentTime = ((currentSong.duration) * percent) / 100;

  })

  //Adding an eventlistner to hamburger
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  })
  // Event listner for close
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  })

  //Event listener for previous
  previous.addEventListener("click", () => {
    currentSong.pause()
    console.log("Previous clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index - 1) >= 0) {
      playMusic(songs[index - 1])
    }
  })

  //Event listener for next
  next.addEventListener("click", () => {
    currentSong.pause()
    console.log("Next clicked")
    let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    if ((index + 1) < songs.length) {
      playMusic(songs[index + 1])
    }
  })

  // Add event to volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change", (e) => {
    console.log("volume is set on " + e.target.value + "/ 100")
    currentSong.volume = parseInt(e.target.value) / 100
  })

}
main()
