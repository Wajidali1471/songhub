let currentPlayingButton = null; 
let currentLiButton = null; // li button track
const CLIENT_ID = "4675c34e";

const songsDiv = document.getElementById("songs");
const audioPlayer = document.getElementById("audioPlayer");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.querySelector(".search_btn");
const searchBox = document.querySelector(".search-box");
const closeBtn = document.querySelector(".search-box-close");
const searchForm = document.querySelector(".h");

// ====== SEARCH FUNCTION ======
async function searchSongs(defaultQuery) {
    document.querySelector(".w").innerHTML = "";
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

            // li element
            li.innerHTML = `
                <span>${song.name}</span> 
                <span>${song.artist_name}</span>
                <button class="li_btn" data-audio="${song.audio}">▶</button>
            `;

            // card element
            card.innerHTML = `
                <img src="${image}">
                <img id="hover_logo" src="images/logo3.png" alt="" >
                <h3>${song.name}<mark>by Songhub</mark></h3>
                <p>${song.artist_name}</p>
                <button class="btn" data-audio="${song.audio}">Play</button>
            `;

            const playBtn = card.querySelector("button");
            const liBtn = li.querySelector("button");

            // ====== PLAY BUTTON CLICK ======
            playBtn.addEventListener("click", () => {
                // Reset previous buttons
                if (currentPlayingButton && currentPlayingButton !== playBtn) {
                    currentPlayingButton.innerText = "Play";
                }
                if (currentLiButton && currentLiButton !== liBtn) {
                    currentLiButton.innerText = "▶";
                }

                // Set current buttons
                playBtn.innerText = "Playing";
                liBtn.innerText = "| | ";

                currentPlayingButton = playBtn;
                currentLiButton = liBtn;

                playSong(song.audio);
            });

            // li button click sync with card
            liBtn.addEventListener("click", () => {
                playBtn.click(); // just trigger card button click
            });

            songsDiv.appendChild(card);
            document.querySelector(".w").appendChild(li);
        });

    } catch (err) {
        console.error(err);
        songsDiv.innerHTML = "<p>Reload the page</p>";
    }
}

// ====== PLAY FUNCTION ======
function playSong(audioUrl) {
    if (!audioUrl) return;
    audioPlayer.src = audioUrl;
    audioPlayer.play();
}

// ====== HAMBURGER MENU ======
document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
    document.querySelector(".playbar").style.left="-600%"
});
document.querySelector(".hamburger-close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
    document.querySelector(".playbar").style.left="50%"
});

// ====== SEARCH BOX SHOW/HIDE ======
searchBox.style.display = "none";
closeBtn.style.display = "none";

searchBtn.addEventListener("click", (e) => {
    e.preventDefault();
    searchBtn.style.display = "none";
    searchBox.style.display = "block";
    closeBtn.style.display = "inline";
});

closeBtn.addEventListener("click", () => {
    searchBox.style.display = "none";
    closeBtn.style.display = "none";
    searchBtn.style.display = "flex";
});

// ====== SEARCH FORM SUBMIT ======
searchForm.addEventListener("click", (e) => {
    e.preventDefault();
    searchSongs();
});

// ====== RANDOM DEFAULT SEARCH ======
const defaultQueries = ["punjabi", "urdu", "hindi", "wa", "sultan", "study", "bollywood", "love songs"];

window.addEventListener("DOMContentLoaded", () => {
    const randomQuery = defaultQueries[Math.floor(Math.random() * defaultQueries.length)];
    searchSongs(randomQuery);
});
