const express = require('express');
const path = require('path');
const WriteToCsv = require('./WriteToCsv');
const app = express();
const port = 3000;

app.listen(port, () => console.log(`App running at: http://localhost:${port}`));

// Middleware to display what is being requested
app.use(express.json());
app.use(function(req, res, next){
    console.log(req.method+" request for " + req.url);
    next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/html/index.html')));

app.post('/password', (req, res) =>{
    console.log(req.body)
    WriteToCsv.WriteToCsv(req.body)
    res.send('password received')
  });

// Static server for favicon, style, and JS files
app.use(express.static(__dirname + "/public"));
