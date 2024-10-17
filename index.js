require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('dns')

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));


app.get('/', function(req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

app.use(express.urlencoded({ extended: true }));

const urlStorage = {};

app.post("/api/shorturl", (req, res) => {
  const { url } = req.body;
  const short_url = Math.floor(Math.random() * 100);  
  let hostname;

  try {
    hostname = new URL(url).hostname; 
  } catch (error) {
    return res.json({ error: "invalid url" });
  }

  dns.lookup(hostname, (err) => {
    if (err) {
      return res.json({ error: "invalid url" });
    }

    urlStorage[short_url] = url;

    res.json({
      original_url: url,
      short_url
    });
  });
});

app.get("/api/shorturl/:short_url", (req, res) => {
  const short_url = parseInt(req.params.short_url);
  const url = urlStorage[short_url];
  let urlObj;

  if (url) {
    urlObj = new URL(url);
    return res.redirect(url); 
  } else {
    return res.json({
      error: "URL not found"
    });
  }
});



app.listen(port, function() {
  console.log(`Listening on port ${port}`);
});
