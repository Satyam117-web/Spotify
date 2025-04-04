console.log("Hello guy sto my Spotify!!!")
let currentSong = new Audio();
let songs;

function secondsToMinutes(seconds) {
    if(isNaN(seconds)|| seconds <0){
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
async function getSong() {
    let a = await fetch( "http://127.0.0.1:3000/Song/" )
    let response = await a.text()
    console.log(response)
    let div = document.createElement("div")
    div.innerHTML = response
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let i = 0; i < as.length; i++) {
        const element = as[i];
        if(element.href.endsWith(".mp3"))
            songs.push(element.href.split("/Song/")[1])
    }
    return songs
}

const playMusic =(track,pause=false)=>{
    currentSong.src="/Song/" + track;
    if(!pause){

        currentSong.play();
        play.src="pause.svg"
    }
    document.querySelector(".songinfo").innerHTML=decodeURI( track)
    document.querySelector(".songtime").innerHTML="00:00/00:00"

}



async function main() {

    // getting song
    songs = await getSong()
    console.log(songs)

    playMusic(songs[0],true)


    // Showing the list of songs int he library
    let songUL = document.querySelector(".songlist").getElementsByTagName("ul")[0]
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
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        }) 
    })

    // Attaching play pause and next to the song 
    play.addEventListener("click",()=>{
        if(currentSong.paused){
           currentSong.play();
           play.src="pause.svg"
        }
        else{
            currentSong.pause();
            play.src="play.svg"
        }
    })

    // Listens the timeduration of the song 
    currentSong.addEventListener("timeupdate",()=>{
        // console.log(currentSong.currentTime,currentSong.duration)
        document.querySelector(".songtime").innerHTML=`
        ${ secondsToMinutes(currentSong.currentTime)}/
        ${ secondsToMinutes(currentSong.duration)}`
        document.querySelector(".circle").style.left=(currentSong.currentTime/currentSong.duration)*100 + "%";
    })

    document.querySelector(".seekbar").addEventListener("click",e=>{
        let percent=(e.offsetX/e.target.getBoundingClientRect().width)*100
        document.querySelector(".circle").style.left= percent +"%";
        currentSong.currentTime=((currentSong.duration)*percent)/100;
        
    })

    //Adding an eventlistner to hamburger
    document.querySelector(".hamburger").addEventListener("click",()=>{
        document.querySelector(".left").style.left="0";
    })
    // Event listner for close
    document.querySelector(".close").addEventListener("click",()=>{
        document.querySelector(".left").style.left="-120%";
    })

    //Event listener for previous
    previous.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Previous clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index-1)>=0) {
            playMusic(songs[index-1])
        }
    })

    //Event listener for next
    next.addEventListener("click", ()=>{
        currentSong.pause()
        console.log("Next clicked")
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index+1)<songs.length) {
            playMusic(songs[index+1])
        }
    })

    // Add event to volume
    document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change",(e)=>{
        console.log("volume is set on " + e.target.value + "/ 100")
        currentSong.volume=parseInt(e.target.value)/100
    })
}
main()