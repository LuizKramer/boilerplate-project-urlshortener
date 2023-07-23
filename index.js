require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const dns = require('node:dns');
const bodyParser = require('body-parser');
const { redirect } = require('express/lib/response');

// Basic Configuration
const port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
  res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
  res.json({ greeting: 'hello API' });
});

const options = {
  family: 6,
  hints: dns.ADDRCONFIG | dns.V4MAPPED,
};

let arr = [];
let count = 0;

app.post("/api/shorturl",   (req, res) => {
  console.log(req.body.url);
  dns.lookup(new URL(req.body.url).hostname, (err, address, family) => {
    console.log(err, address, family);
    if(err){
      console.log("Invalid URL");
      return res.json({
        error: 'invalid url'
      });
    }
    if(!arr[count]){
      count++;
    }
    arr[count] = req.body.url;
    return res.json({
      original_url: req.body.url,
      short_url: count
    })

  })
})

app.get('/api/shorturl/:short_url?', (req, res) =>{
 
    if(arr[req.params.short_url]){
     return res.redirect(arr[req.params.short_url]);
    }
  
})

app.listen(port, function () {
  console.log(`Listening on port ${port}`);
});
