// References HTML elements
const postForm = document.getElementById("post-form");
const searchForm = document.getElementById("search-form");
const searchInput = document.getElementById("search-input");
const resultsContainer = document.getElementById("results-container");
const selectedTracksList = document.getElementById("selected-tracks");

// Creates an empty array to store selected tracks for the post
let selectedTracks = [];

// Adds an event listener to the post form to handle when submitted
postForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  // Gets the values of the post title and content from the form inputs
  const title = postTitle.value;
  const content = postContent.value;
  postTitle.value = "";
  postContent.value = "";

  // Send a POST request to our backend with the posta data
  // try {
  const response = await fetch("/api/post", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      title: title,
      content: content,
      tracks: selectedTracks,
    }),
  });
  const data = await response.json();

  const trackTitle = document.querySelector("#post-title");
  const postContent2 = document.querySelector("#post-content");

  // Creates HTML elements for the post title and content
  const postDiv = document.createElement("div");
  const postTitle = document.createElement("h2");
  const postContent = document.createElement("p");
  postTitle.innerText = data.title;
  trackTitle.value = data.title;
  postContent2.value = data.content;
  postContent.innerText = data.content;
  postDiv.appendChild(postTitle);
  postDiv.appendChild(postContent);

  // Creates the HTML elements for the selected tracks

  const tracksList = document.createElement("ul");
  selectedTracks.forEach((track) => {
    const trackItem = document.createElement("li");
    const trackName = document.createElement("span");
    const artistName = document.createElement("span");
    trackName.textContent = track.name;
    artistName.textContent = track.artists[0].name;
    trackItem.appendChild(trackName);
    trackItem.appendChild(artistName);
    tracksList.appendChild(trackItem);
  });
  postDiv.appendChild(tracksList);

  // Adds the new post to the page

  const postContainer = document.getElementById("post-container");
  postContainer.appendChild(postDiv);

  // Resets the selected tracks list
  selectedTracks = [];
  selectedTracksList.innerHTML = "";
});

// Event listener for when the user searches for music
searchForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  const query = searchInput.value;

  // Here we fetch the data from spotify's API and our back end to match the frontend search
  const url = `/api/music/search?q=${query}`;
  // try {
  const response = await fetch(url);
  const data = await response.json();
  resultsContainer.innerHTML = "";
  // Returns the first 3 tracks
  data.slice(0, 3).forEach((track) => {
    // Elements for each track with artist name and track name
    const trackDiv = document.createElement("div");
    const trackName = document.createElement("h3");
    const artistName = document.createElement("p");
    // Gives us the artist and track names that we put in our results container
    trackName.textContent = track.name;
    artistName.textContent = track.artists[0].name;
    trackDiv.appendChild(trackName);
    trackDiv.appendChild(artistName);
    resultsContainer.appendChild(trackDiv);

    // If the result is not null and there is a track preview, we have our audio player and the controls

    if (track.preview_url) {
      const audio = document.createElement("audio");
      audio.src = track.preview_url;

      const controls = document.createElement("div");
      const playBtn = document.createElement("button");
      const pauseBtn = document.createElement("button");
      const rewindBtn = document.createElement("button");

      // We use the Font Awesome Icons to make it so that the btns look like play, pause rather than say the name.

      playBtn.innerHTML = '<i class="fas fa-play"></i>';
      pauseBtn.innerHTML = '<i class="fas fa-pause"></i>';
      rewindBtn.innerHTML = '<i class="fas fa-backward"></i>';

      // Event listeners for the audio controls

      playBtn.addEventListener("click", () => {
        audio.play();
      });

      pauseBtn.addEventListener("click", () => {
        audio.pause();
      });

      rewindBtn.addEventListener("click", () => {
        audio.currentTime = 0;
      });

      // Append the audio players and its features to the trackDiv

      controls.appendChild(playBtn);
      controls.appendChild(pauseBtn);
      controls.appendChild(rewindBtn);
      trackDiv.appendChild(controls);
      trackDiv.appendChild(audio);
    } else {
      // If there's no track preview
      const noPreview = document.createElement("p");
      noPreview.textContent = "Preview not available";
      trackDiv.appendChild(noPreview);
    }

    // Add a button to add the track to the post
    const addTrackBtn = document.createElement("button");
    addTrackBtn.textContent = "Add to post";
    addTrackBtn.classList.add("add-track-btn");
    trackDiv.appendChild(addTrackBtn);

    // When the button is clicked, add the track to the post
    addTrackBtn.addEventListener("click", () => {
      // Get the selected artist, track name, song preview
      const selectedArtistName = track.artists[0].name;
      const selectedTrackName = track.name;
      const selectedTrackURL = track.preview_url;
      const selectedTrackAlbum = track.album.name;

      // Push values to the new post form
      const newPostTitle = document.querySelector("#post-title");
      const newSongURL = document.querySelector("#song-url");
      const newSongArtist = document.querySelector("#artist");
      const newSongAlbum = document.querySelector("#album");

      // Add the new post to the page
      newPostTitle.value = selectedTrackName;
      newSongURL.value = selectedTrackURL;
      newSongArtist.value = selectedArtistName;
      newSongAlbum.value = selectedTrackAlbum;
    });
  });
});
