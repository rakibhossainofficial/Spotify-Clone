console.log("let's write Javascript")
let currentSong = new Audio();

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}

async function getSongs(){
    let a = await fetch("http://127.0.0.1:5500/songs/")
    let response = await a.text();
    let div = document.createElement("div")
    div.innerHTML = response;
    let as = div.getElementsByTagName("a")
    let songs = []
    for (let index =0; index < as.length;index++){
        const element = as[index];
        if(element.href.endsWith(".mp3")){
            songs.push(element.href.split("/songs/")[1])
        }

    }
    return songs
}

const playMusic = (track, pause=false) =>{
    // let audio = new Audio("/song/" + track)
    currentSong.src = "/songs/" + track
    if(!pause){
        currentSong.play()
        play.src = "pause.svg"  
    }

    // show song info
    document.querySelector(".songinfo").innerHTML = decodeURI(track)
    document.querySelector(".songtime").innerHTML = "00:00 / 00:00"   

}

async function main(){


    // Get the list of all songs
    let songs = await getSongs()
    console.log(songs)

    playMusic(songs[0], true)

    let songUL = document.querySelector(".song-list").getElementsByTagName("ul")[0]
    for (const song of songs) {
        songUL.innerHTML = songUL.innerHTML + `
        <li>
            <img src="./music.svg" alt="music icon">
            <div class="info flex">
                <div> ${song.replaceAll("%20"," ")}</div>
                <div> </div>   
            </div>
            <div class="play-now flex">
                <span>Play Now</span>
                <img src="./play.svg" class="invert" alt="play now">
            </div>
        </li>`;
       
    }


    // Attach an event listener to each song
   Array.from(document.querySelector(".song-list").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            console.log(e.querySelector(".info").firstElementChild.innerHTML)
            playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim())
        })      
   })


   // Attach an event listener to play, next and previous
   play.addEventListener("click", ()=>{
    if(currentSong.paused){
        currentSong.play()
        play.src = "pause.svg"
    }else{
        currentSong.pause()
        play.src = "play.svg"
    }
   })

   // Listen for timeUpdate event
   currentSong.addEventListener("timeupdate", ()=>{
    console.log(currentSong.currentTime, currentSong.duration);
    document.querySelector(".songtime").innerHTML  = `${secondsToMinutesSeconds(currentSong.currentTime)}:${secondsToMinutesSeconds(currentSong.duration)}`
    document.querySelector(".circle").style.left = (currentSong.currentTime/currentSong.duration) * 100 + "%";
   })

   // Add an event listeneer to seekbar
   document.querySelector(".seekbar").addEventListener("click", e=>{
    let parcent = (e.offsetX/e.target.getBoundingClientRect().width)* 100;
    document.querySelector(".circle").style.left = parcent + "%";
    currentSong.currentTime = ((currentSong.duration)* parcent)/100
   })

   // Add an Event Listener for hamburger
   document.querySelector(".hamburger").addEventListener("click",() =>{
        document.querySelector(".left").style.left ="0";
   })

   // Add an Event Listener for close button
   document.querySelector(".close").addEventListener("click",() =>{
    document.querySelector(".left").style.left ="-100%";
    })

}

main()