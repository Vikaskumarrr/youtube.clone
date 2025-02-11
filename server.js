const express = require('express');
const path = require('path');

const app = express();

// Add this route handler
app.get('/watch', (req, res) => {
    res.sendFile(path.join(__dirname, 'video.html'));
});

// Make sure you're serving static files
app.use(express.static(__dirname));

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
