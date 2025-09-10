console.log("lets write js");

function formatTime(seconds) {
    let minutes = Math.floor(seconds / 60);
    let secs = Math.floor(seconds % 60);

    // Add leading zeros
    let mm = String(minutes).padStart(2, "0");
    let ss = String(secs).padStart(2, "0");

    return `${mm}:${ss}`;
}



let songs ;
let currentSong = new Audio
let currFolder;


async function getSongs(folder) {
    currFolder = folder
    // let api = await fetch(`http://127.0.0.1:5500/${folder}`)
    // let api = await fetch(`${folder}`)
    let api = await fetch(`${folder}`)
    let response = await api.text()



    // 1 div cretae kia 
    let div = document.createElement("div")
    // uski innner html ma response ko store kr diya 
    div.innerHTML = response
    // phir us div ma sa  sary {a = href} nikal liya 
    // or href wo nikalna ha jis ka href ma song ha 
    let as = div.getElementsByTagName("a")


    // ek empty array banaya
  songs = []

    // espa for loop chalaya songs niklaka array ma push kr diya
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        // ya condition kah rhi ha agar song {".mp3"} pa end ho rha hoto songs ma push krdo
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${folder}/`)[1] // Get just the filename
            );
        }
    }


    let container = document.getElementById("container")
    container.innerHTML = ""
    for (let index = 0; index < songs.length; index++) {
        const element = songs[index];
        container.innerHTML += `
     
  <li class="liOfLibrary">
                <img class="invert musciSvg" src="./svgFiles/Music.svg" alt="">
                <div class="info">
                  <div>${element.replaceAll("%20", " ")}</div>
                </div>
                <div class="playNow">
                  <span>play Now</span>
                  <img class="invert PlaynowImgLi" src="./svgFiles/playforSongLi.svg" alt="">
                </div>
              </li>  `
    }


    
    // attach an event listner for each song 
    Array.from(document.getElementById("container").getElementsByTagName("li"))
        // array bana ka loop chala ka sary element la liya 
        .forEach(e => {
            e.addEventListener("click", element => {
                playMusic(e.querySelector(".info").firstElementChild.innerHTML)
            })
        });

        return songs


}




function playMusic(track, pasue = false) {

    currentSong.src = `/${currFolder}/` + track
    if (!pasue) {
        currentSong.play()
        play.src = "./svgFiles/pause.svg"
    }
    document.querySelector(".songName").innerHTML = decodeURI(track.replaceAll(".mp3", ""))
    document.querySelector(".SongDuratio").innerHTML = "00:00/00:00"
}



async function displayAlbums() {
    // let api = await fetch(`http://127.0.0.1:5500/Music`)
//   let api = await fetch("public/Music")
let api = await fetch("Music")

    let response = await api.text()
    let div = document.createElement("div")
    div.innerHTML = response
    let anchors = div.getElementsByTagName("a")
    let cardCont = document.querySelector(".cardContainer")
    let ancArr = Array.from(anchors)
    for (let index = 0; index < ancArr.length; index++) {
        const element = ancArr[index];
        if (element.href.includes("/Music/")) {
            // let folders = element.href.split("/").slice(-2)[0]
            let folder = element.href.split("/").filter(Boolean).pop()



            //get the meta deta of folder  
            // let api = await fetch(`http://127.0.0.1:5500/Music/${folder}/info.json`)
            // let api = await fetch(`public/Music/${folder}/info.json`)
            let api = await fetch(`Music/${folder}/info.json`)

            let response = await api.json()
            cardCont.innerHTML += `
            
             <div class="Card" data-folder="${folder}">
                <div class="icon-circle">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
                    <path
                      d="M187.2 100.9C174.8 94.1 159.8 94.4 147.6 101.6C135.4 108.8 128 121.9 128 136L128 504C128 518.1 135.5 531.2 147.6 538.4C159.7 545.6 174.8 545.9 187.2 539.1L523.2 355.1C536 348.1 544 334.6 544 320C544 305.4 536 291.9 523.2 284.9L187.2 100.9z" />
                  </svg>
                </div>

      <img class="imgcard" src="Music/${folder}/cover.jpeg" alt="">
                <h3 class="cradHeading">${response.title}</h3>
                <p class="cradPara">${response.description}</p>
              </div>
            `

        }
    }


        // load playlist whenever card is clicked 
    Array.from(document.getElementsByClassName("Card")).forEach(e => {
        e.addEventListener("click", async item => {
            // console.log(item.currentTarget.dataset);
            songs = await getSongs(`Music/${item.currentTarget.dataset.folder}`)
        })
    });

}


// ya function songs play kary ga 
async function playSong() {
    // await getSongs("Music/EngSongs")
    // await getSongs("public/Music/EngSongs")
    await getSongs("Music/EngSongs")
    playMusic(songs[0], true)



    // display all Albums on the page 
    displayAlbums()


    // play/pause  the song 
    play.addEventListener("click", () => {
        if (currentSong.paused) {
            currentSong.play()
            play.src = "./svgFiles/pause.svg"
        } else {
            currentSong.pause()
            play.src = "./svgFiles/playforSongLi.svg"
        }
    })



    // for time update of song  
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".SongDuratio").innerHTML = `
 ${formatTime(currentSong.currentTime)}/${formatTime(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"
    })




    // add EventListener for seekbar for move it on click  
    document.querySelector(".seekbar").addEventListener("click", e => {
        //  console.log(e.offsetX/e.target.getBoundingClientRect().width)*100 ;
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100
        document.querySelector(".circle").style.left = percent + "%"
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })




    document.querySelector(".hamburger").addEventListener("click", () => {
        document.querySelector(".right").style.left = 0 + "%"
    })

    document.querySelector(".cross").addEventListener("click", () => {
        document.querySelector(".right").style.left = -120 + "%"
    })




    // to play the previous  song 
    // previous.addEventListener("click", () => {
    //     console.log("Previous Button Clicked");
    //     let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
    //     if (index <= 0) {
    //         previous.disabled = true
    //     } else {
    //         playMusic(songs[index - 1])
    //     }
    // })


    previous.addEventListener("click", () => {
    console.log("Previous Button Clicked");
    let filename = currentSong.src.split(`/${currFolder}/`)[1]   
    let index = songs.indexOf(filename)

    if (index <= 0) {
        previous.disabled = true
    } else {
        playMusic(songs[index - 1])
    }
})



    // to plat the next song 
  next.addEventListener("click", () => {
    console.log("next Button Clicked");
    let filename = currentSong.src.split(`/${currFolder}/`)[1]   
    let index = songs.indexOf(filename)
    console.log(index);

    if (index >= songs.length - 1) {
        next.disabled = true
    } else {
        playMusic(songs[index + 1])
    }
})



    // for volume button  
    document.querySelector(".volumeButton input").addEventListener("change", (e) => {
        console.log("volume setting to " + e.target.value + "/100");
        currentSong.volume = (e.target.value) / 100
    });





}



playSong()




