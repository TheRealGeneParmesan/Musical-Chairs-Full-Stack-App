const newFormHandler = async (event) => {
  event.preventDefault();

  const title = document.querySelector("#post-title").value.trim();
  const content = document.querySelector("#post-content").value.trim();
  const song_url = document.querySelector("#song-url").value.trim();
  const artist = document.querySelector("#artist").value.trim();
  const album = document.querySelector("#album").value.trim();

  if (title && content) {
    const response = await fetch(`/api/post`, {
      method: "POST",
      body: JSON.stringify({ title, content, song_url, artist, album }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      document.location.replace("/profile");
    } else {
      alert("Failed to create post");
    }
  }
};

document.querySelector("#post-form").addEventListener("submit", newFormHandler);
