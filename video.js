const API_KEY = "AIzaSyAA13mNy3utl4-TX1TFVnSUhKH0K-FfRLY"; // Use your API key
const search = window.location.search;
const params = new URLSearchParams(search);
const videoId = params.get("videoId");

// Add video player to the page
const videoContainer = document.getElementById('video-container');
if (videoId && videoContainer) {
    // Create YouTube embed iframe
    const iframe = document.createElement('iframe');
    iframe.src = `https://www.youtube.com/embed/${videoId}`;
    iframe.width = '100%';
    iframe.height = '500';
    iframe.allowFullscreen = true;
    iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
    
    // Add iframe to container
    videoContainer.appendChild(iframe);
    
    // Fetch video details
    fetchVideoDetails(videoId);
    // Fetch related videos
    fetchRelatedVideos(videoId);
} else {
    console.error('Video ID not found or video container not present');
}

async function fetchVideoDetails(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoId}&key=${API_KEY}`
        );
        const data = await response.json();
        const videoDetails = data.items[0];
        
        // Update video details
        document.getElementById('video-title').textContent = videoDetails.snippet.title;
        document.getElementById('channel-name').textContent = videoDetails.snippet.channelTitle;
        document.getElementById('video-description').textContent = videoDetails.snippet.description;
        document.getElementById('like-count').textContent = formatCount(videoDetails.statistics.likeCount);
        
        // Fetch channel details
        fetchChannelDetails(videoDetails.snippet.channelId);
    } catch (error) {
        console.error('Error fetching video details:', error);
    }
}

async function fetchChannelDetails(channelId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${channelId}&key=${API_KEY}`
        );
        const data = await response.json();
        const channel = data.items[0];
        
        document.getElementById('channel-avatar').src = channel.snippet.thumbnails.default.url;
        document.getElementById('subscriber-count').textContent = 
            `${formatCount(channel.statistics.subscriberCount)} subscribers`;
    } catch (error) {
        console.error('Error fetching channel details:', error);
    }
}




async function fetchRelatedVideos(videoId) {
    try {
        const response = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&relatedToVideoId=${videoId}&type=video&maxResults=15&key=${API_KEY}`
        );
        const data = await response.json();
        displayRelatedVideos(data.items);
    } catch (error) {
        console.error('Error fetching related videos:', error);
    }
}

function displayRelatedVideos(videos) {
    const relatedVideosContainer = document.getElementById('related-videos');
    relatedVideosContainer.innerHTML = videos.map(video => `
        <div class="related-video-card" data-video-id="${video.id.videoId}">
            <div class="related-thumbnail-container">
                <img class="related-thumbnail" src="${video.snippet.thumbnails.medium.url}" alt="${video.snippet.title}">
                <span class="video-duration">4:15</span>
            </div>
            <div class="related-video-info">
                <h3 class="related-video-title">${video.snippet.title}</h3>
                <p class="related-channel-name">${video.snippet.channelTitle}</p>
                <p class="related-video-metadata">15K views • 2 days ago</p>
            </div>
        </div>
    `).join('');

    // Add click handlers for related videos
    document.querySelectorAll('.related-video-card').forEach(card => {
        card.addEventListener('click', () => {
            const videoId = card.dataset.videoId;
            window.location.href = `/watch?videoId=${videoId}`;
        });
    });
}

function formatCount(count) {
    if (count >= 1000000) {
        return (count / 1000000).toFixed(1) + 'M';
    } else if (count >= 1000) {
        return (count / 1000).toFixed(1) + 'K';
    }
    return count;
}

// Add event listeners for buttons
document.querySelector('.like-btn').addEventListener('click', function() {
    this.classList.toggle('active');
});

document.querySelector('.subscribe-btn').addEventListener('click', function() {
    this.classList.toggle('subscribed');
    this.textContent = this.classList.contains('subscribed') ? 'Subscribed' : 'Subscribe';
});