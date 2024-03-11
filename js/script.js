let curentSong = new Audio();
let songs
let currFolder;

function convertSecondsMinutes(seconds) {
  if(isNaN(seconds) || seconds < 0){
    return "00:00"
  }
  // Ensure input is a positive integer
  seconds = Math.abs(parseInt(seconds));

  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  // Format the time string
  const formattedTime =
    minutes.toString().padStart(2, "0") +
    ":" +
    remainingSeconds.toString().padStart(2, "0");

  return formattedTime;
}



async function getSongs(folder) {
  currFolder = folder;
  let a = await fetch(`/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];

  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

    // Show all the songs in the Play list
    let songUL = document
    .querySelector(".songList")
    .getElementsByTagName("ul")[0];
    songUL.innerHTML =""
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="images/music.svg" alt="">
     <div class="info">
       <div> ${song.replaceAll("%20", " ")}</div>
       <div>Asad</div>
     </div>
     <div class="playnow">
       <span>Play Now</span>
       <img class="invert" src="images/play.svg" alt="">
     </div>  </li>`;
  }
    //Attach event listener for each song
    Array.from(
      document.querySelector(".songList").getElementsByTagName("li")
    ).forEach((e) => {
      e.addEventListener("click", (element) => {
        // console.log(e.querySelector(".info").firstElementChild.innerHTML);
        playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
      });
    });






    return songs;
}



const playMusic = (track , pause=false) => {
  curentSong.src = `/${currFolder}/` + track;
  if(!pause){
  curentSong.play();
  play.src = "images/pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".songtime").innerHTML = "00:00 / 00:00";
};

  

async function displayAlbums(){
  let a = await fetch(`/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors =div.getElementsByTagName("a")
  let cardContainer = document.querySelector(".cardContainer")
  let array = Array.from(anchors)
  for (let index = 0; index < array.length; index++) {
    const e = array[index];
    if(e.href.includes("/songs")  && !e.href.includes(".htaccess")){
      let folder = (e.href.split("/").slice(-2)[0]);
      //  Get the mata data of the folder
      let a = await fetch(`/songs/${folder}/info.json`);
      let response = await a.json();
      console.log(response);
      cardContainer.innerHTML = cardContainer.innerHTML + `<div data-folder="${folder}" class="card">
      <div class="play">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="#000"
          xmlns="http:// www.w3.org/2000/svg"
        >
          <path
            d="M5 20V4L19 12L5 20Z"
            stroke="#141834"
            stroke-width="1.5"
            stroke-linejoin="round"
          />
        </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg"alt="" />
      <h2>${response.title}</h2>
      <p>${response.description}</p>
    </div>`
      
    }

  }

  // Load the playlist whenever card is clicked
Array.from(document.getElementsByClassName("card")).forEach(e=>{
  e.addEventListener("click" , async item=>{
    songs = await getSongs(`songs/${item.currentTarget.dataset.folder}`)  
    playMusic(songs[0]);
  })
})
   
  
}

  

async function main() {
  //Get the list of all songs
  await getSongs("songs/ncs");
  playMusic(songs[0] , true);


  // Display all the albums on the page
  await displayAlbums();





  //Attach an event listener to play , next and previous
  play.addEventListener("click", () => {
    if (curentSong.paused) {
      curentSong.play();
      play.src = "images/pause.svg";
    } else {
      curentSong.pause();
      play.src = "images/play.svg";
    }
  });

  //Listen for timeUpdate event
  curentSong.addEventListener("timeupdate", () => {
    document.querySelector(".songtime").innerHTML = `${convertSecondsMinutes(curentSong.currentTime)}:${convertSecondsMinutes(curentSong.duration)}`;
    document.querySelector(".circle").style.left = (curentSong.currentTime / curentSong.duration) *100 +"%";
  });

  // Ad an event listener to seek bar
  document.querySelector(".seekbar").addEventListener("click" , (e)=>{
    let percent = (e.offsetX/e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    curentSong.currentTime = ((curentSong.duration ) * percent) /100
  })

  //Add an  event listener for Hamburger 
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0"
  })

  //Add an  event listener for Hamburger close 

  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-130%"
  })

  // Add an event listener for previous and next button

  previous.addEventListener("click" , ()=>{
    let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0])
    if((index-1)>=0){
      playMusic(songs[index-1])
    }
    
  })

  next.addEventListener("click" , ()=>{
    let index = songs.indexOf(curentSong.src.split("/").slice(-1)[0])
    if((index+1)<songs.length){
      playMusic(songs[index+1])
    }
  }) 

  // Add an event listener for volume
  document.querySelector(".range").getElementsByTagName("input")[0].addEventListener("change" , (e)=>{
    curentSong.volume = parseInt(e.target.value)/100
  })
//Add an event litener to mute track
document.querySelector(".volume>img").addEventListener("click" , (e)=>{
  if(e.target.src.includes("volume.svg")){
    e.target.src = e.target.src.replace("images/volume.svg" ,"images/mute.svg")
    curentSong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  }
  else{
    e.target.src = e.target.src.replace("images/mute.svg" ,"images/volume.svg")
    curentSong.volume = .10;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 20;


  }
})


}
main();
