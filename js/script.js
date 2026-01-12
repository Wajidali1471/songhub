// ================= CONFIG =================
const CLIENT_ID = "4675c34e";

// ================= ELEMENTS =================
const audioPlayer = document.getElementById("audioPlayer");
const playlistUL = document.querySelector(".w");
const songsRow = document.querySelector(".container2");

// Form & Input
const searchForm = document.getElementById("searchForm");
const searchInput = document.getElementById("searchInput");

// ================= GLOBAL =================
let currentBtn = null;

// ================= SEARCH SONGS =================
async function searchSongs(query = "punjabi") {

    // ✅ SHOW LOADING
songsRow.innerHTML = `
  <div class="text-center my-4">
  <span class="ms-2" style="color:white;">Loading</span>
    <div class="spinner-border spinner-border-sm text-light" role="status"></div>
    
  </div>
`;


    playlistUL.innerHTML = "<li>Loading...</li>";

    try {
        const url = `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=8&search=${encodeURIComponent(query)}`;
        const res = await fetch(url);
        const data = await res.json();

        // ✅ CLEAR AFTER LOAD
        songsRow.innerHTML = "";
        playlistUL.innerHTML = "";

        if (!data.results || data.results.length === 0) {
            songsRow.innerHTML = "<p class='text-center'>No songs found</p>";
            playlistUL.innerHTML = "<li>No songs found</li>";
            return;
        }

        data.results.forEach(song => {

            /* ================= PLAYLIST ================= */
            const li = document.createElement("li");
            const liBtn = document.createElement("button");

            liBtn.className = "btn btn-sm btn-success";
            liBtn.innerText = "Play";
            liBtn.onclick = () => handlePlay(song.audio, liBtn);

            li.innerHTML = `
                <span>${song.name}</span>
                <span>${song.artist_name}</span>
            `;
            li.appendChild(liBtn);
            playlistUL.appendChild(li);

            /* ================= CARD ================= */
            const card = document.createElement("div");
            card.className = "card mb-3";

            const image = song.image
                ? song.image
                : "https://via.placeholder.com/300x300?text=No+Image";

            card.innerHTML = `
                <img src="${image}" class="card-img-top">
                <img id="hover_logo" src="images/hover_logo.png" alt="">
                <h3>${song.name}</h3>
                <p>${song.artist_name}</p>
                <button class="play_btn">Play</button>
            `;

            // ✅ FIXED CLASS NAME
            const cardBtn = card.querySelector(".play_btn");
            cardBtn.onclick = () => handlePlay(song.audio, cardBtn);

            songsRow.appendChild(card);
        });

    } catch (error) {
        console.error(error);
        songsRow.innerHTML = "<p>Error loading songs</p>";
        playlistUL.innerHTML = "<li>Error loading songs</li>";
    }
}

// ================= PLAY / PLAYING =================
function handlePlay(audioUrl, btn) {
    if (!audioUrl) {
        alert("Audio not available");
        return;
    }

    // reset previous button
    if (currentBtn) {
        currentBtn.innerText = "Play";
    }

    // set current button
    btn.innerText = "Playing";
    currentBtn = btn;

    // play audio
    audioPlayer.src = audioUrl;
    audioPlayer.load();
    audioPlayer.play().catch(err => {
        console.log("Play error:", err);
    });
}

// ================= SEARCH FORM =================
searchForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const query = searchInput.value.trim();
    if (query) searchSongs(query);
});
const randomSongs = [
    "punjabi",
    
    "arijit singh",
    "arijit singh",
    "arijit singh",
    "arijit singh",
    "romantic",
    "sad",
    "sufi",
    "wa",
    "sultan"
    ,

    "lofi"
];
function getRandomSong() {
    const index = Math.floor(Math.random() * randomSongs.length);
    return randomSongs[index];
}

window.addEventListener("DOMContentLoaded", () => {
    const randomQuery = getRandomSong();
    searchSongs(randomQuery);
});
