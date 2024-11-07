// Import express and path modules
const express = require('express');
const path = require('path');

// Create an express application
const app = express();

// Serve static files (CSS, JS, images) from the root directory
app.use(express.static(path.join(__dirname)));

// Route for serving the index.html file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// Start the server on a specific port
const PORT = process.env.PORT || 3000;  // Default to port 3000 or use the environment port
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
