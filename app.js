const express = require('express');
const app = express();
var path = require('path');
const port = 3000;

app.listen(port, () => console.log(`App running at: http://localhost:${port}`));

// Middleware to display what is being requested
app.use(function(req, res, next){
    console.log(req.method+" request for " + req.url);
    next();
});

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/html/index.html')));

// Static server for favicon, style, and JS files
app.use(express.static(__dirname + "/public"));
