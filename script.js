


const CLIENT_ID = "4675c34e";

const songsDiv = document.getElementById("songs");
const audioPlayer = document.getElementById("audioPlayer");
const searchInput = document.getElementById("searchInput");

async function searchSongs(defaultQuery) {
    document.querySelector(".w").innerHTML = ""
     let query = defaultQuery || searchInput.value.trim();
    if (!query) {
        alert("Search keyword likho (urdu / hindi / sufi)");
        return;
    }


    songsDiv.innerHTML = "<p>Loading...</p>";

    try {
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=12&search=${encodeURIComponent(query)}`;

        const res = await fetch(url);
        const data = await res.json();

        songsDiv.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            songsDiv.innerHTML = "<p>No songs found</p>";
            return;
        }

        data.results.forEach(song => {
            const card = document.createElement("div");
            const li = document.createElement("li");
            card.className = "card";

            const image = song.image && song.image !== ""
                ? song.image
                : "https://via.placeholder.com/300x300?text=No+Image";

            li.innerHTML = `
          





             
            
    <span>${song.name}</span> 
    <span>${song.artist_name}</span>
     <button class="li_btn" data-audio="${song.audio}">▶</button>
   

`

            card.innerHTML = `
                <img src="${image}">
               
                        <img id="hover_logo" src="images/logo3.png" alt="" >
                <h3>${song.name}   
                
                <mark>by Songhub</mark>
                </h3>
                <p>${song.artist_name}</p>
                <button class="btn" data-audio="${song.audio}">▶ Play</button>
            `;
            card.querySelector("button").addEventListener("click", () => {
                playSong(song.audio);
            });


            li.querySelector("button").addEventListener("click", () => {
                playSong(song.audio);
            });

            songsDiv.appendChild(card);

            document.querySelector(".w").appendChild(li)

        });

    } catch (err) {
        console.error(err);
        songsDiv.innerHTML = "<p>Error loading songs</p>";
    }
}

function playSong(audioUrl) {
    if (!audioUrl) return;

    audioPlayer.src = audioUrl;
    audioPlayer.play()

}
// =========================//
//  Hamburger menu  //
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
});
document.querySelector(".hamburger-close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
});

let searchBtn = document.querySelector(".search_btn");
let searchBox = document.querySelector(".search-box");
let closeBtn = document.querySelector(".search-box-close");

/* START STATE */
searchBox.style.display = "none";
closeBtn.style.display = "none";

/* SEARCH CLICK */
searchBtn.addEventListener("click", () => {
    searchBtn.style.display = "none";
    searchBox.style.display = "block";
    closeBtn.style.display = "inline";
});

/* CLOSE CLICK */
closeBtn.addEventListener("click", () => {
    searchBox.style.display = "none";
    closeBtn.style.display = "none";
    searchBtn.style.display = "flex";
});

window.addEventListener("DOMContentLoaded", () => {
    searchSongs("punjabi"); // yaha default query set
});
