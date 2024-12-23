const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');

// Initialize the Express app
const app = express();

// Enable CORS (Cross-Origin Resource Sharing)
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Post data from the JSON file to server
app.get('/products', (req, res) => {

    const filePath = path.join(__dirname, 'products.json');
    fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
            return res.status(500).json({ message: 'Error reading the JSON file' });
        }

        try {
            const jsonData = JSON.parse(data);
            res.json(jsonData);
        } catch (parseErr) {
            res.status(400).json({ message: 'Invalid JSON format' });
        }
    });
});

// Start the server
const PORT = 3006;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/products`);
});