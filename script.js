const API_KEY =  "AIzaSyAA13mNy3utl4-TX1TFVnSUhKH0K-FfRLY";
const BASE_URL = "https://www.googleapis.com/youtube/v3"



//GET VIDEO

document.getElementById("search-btn").addEventListener("click",()=>{ 
    getVideos(document.getElementById("search-bar1").value);
})


function getVideos(query){ 

    fetch(`${BASE_URL}/search?key=${API_KEY}&q=${query}&type=video&maxResults=10&part=snippet`)
    .then((res)=> res.json())
    .then((data)=>{ 
        console.log(data)
        displayVideos(data.items)
    })
}

getVideos("")

// Showing or Displaying video 

function displayVideos(videos){ 

    document.getElementById("main-container-1").innerHTML = "";

    videos.map((video, i)=> { 
        document.getElementById("main-container-1").innerHTML += `
        <a href='/video.html?videoId=${video.id.videoId}'
        <li>
        <img class="video-thumbnail" src='${video.snippet.thumbnails.high.url}'/> <p>${video.snippet.title}</p>
        </li>
        </a>
        `
    })
}


document.querySelectorAll('.video-card').forEach(card => {
    card.addEventListener('click', (e) => {
        const videoId = card.dataset.videoId; // Make sure to add data-video-id attribute to your video cards
        if (videoId) {
            window.location.href = `/watch?videoId=${videoId}`;
        }
    });
});



document.addEventListener('DOMContentLoaded', function() {
    const youtubeLogo = document.getElementById('Youtube-logo');
    
    youtubeLogo.addEventListener('click', function() {
        window.location.reload();
    });
    youtubeLogo.style.cursor = 'pointer';
});


document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('search-bar1');
    const searchButton = document.getElementById('search-btn');

    // Function to handle search
    function performSearch() {
        const searchQuery = searchInput.value.trim();
        if (searchQuery) {
            getVideos(searchQuery);
        }
    }

    // Add event listener for Enter key
    searchInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            performSearch();
        }
    });

    // Keep existing click handler for search button
    searchButton.addEventListener('click', function() {
        performSearch();
    });
});


document.querySelector('.side-bar').addEventListener('click', () => {
    window.location.reload();
});



