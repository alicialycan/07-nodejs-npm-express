'use strict';
const express = require('express')

const app = express()

// REVIEW: There is a package here called body-parser, which is used by the provided POST route. Be sure to install that and save it as a dependency after you create your package.json.

const bodyParser = require('body-parser').urlencoded({extended: true});
const PORT = process.env.PORT || 3000;

app.use(express.static('./public'))

app.get('/', (req, res) => {
  response.sendFile('index.html', {root:'./public'});
});

app.get('/new', (req, res) => {
  response.sendFile('new.html', {root:'./public'})
});

app.post('/articles', bodyParser, function(req, res) {
  // REVIEW: This route will receive a new article from the form page, new.html, and log that form data to the console. We will wire this up soon to actually write a record to our persistence layer!
  response.send(request.body);
});

app.listen(PORT, () => {
  console.log(`listening on port: ${PORT}`)
});

app.use((req, res) => response.status(404).sendFile('404.html', {root: './public'}));