require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const validUrl = require('valid-url');
const bodyParser = require("body-parser");

app.use(cors());
// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({ extended: true }));

const urlDatabase = [];
let shortUrlCounter = 1;
app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function(req, res) {
  res.json({ greeting: 'hello API' });
});
// POST /api/shorturl
app.post('/api/shorturl', (req, res) => {
  const originalUrl = req.body.url;
  // Check if the URL is valid
  if (!validUrl.isWebUri(originalUrl)) {
    return res.json({ error: 'invalid url' });
  }
  // Create a short URL entry
  const shortUrl = shortUrlCounter++;
  urlDatabase.push({ originalUrl, shortUrl });

  res.json({ original_url: originalUrl, short_url: shortUrl });
});

// GET /api/shorturl/:short_url
app.get('/api/shorturl/:short_url', (req, res) => {
  const shortUrl = parseInt(req.params.short_url);

  // Find the corresponding original URL
  const urlEntry = urlDatabase.find(entry => entry.shortUrl === shortUrl);

  if (urlEntry) {
    // Redirect to the original URL
    res.redirect(urlEntry.originalUrl);
  } else {
    res.json({ error: 'short url not found' });
  }
});

app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
