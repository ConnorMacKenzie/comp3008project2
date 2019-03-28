const express = require('express')
const app = express()
var path = require('path');
const port = 3000

app.get('/', (req, res) => res.sendFile(path.join(__dirname + '/public/html/index.html')));

app.listen(port, () => console.log(`App running at: http://localhost:${port}`))
