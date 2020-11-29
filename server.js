// load the things we need
var express = require('express');
var app = express();

// set the port we are listening on
var port = 8000

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

// use res.render to load up an ejs view file

// index page
app.get('/', function(req, res) {
    res.render('pages/index');
});

app.get('/meniu', function(req, res) {
    res.render('pages/meniu');
});

app.get('/paginaGrid', function(req, res) {
    res.render('pages/paginaGrid');
});

app.use(function(req, res, next){
    res.status(404).render('pages/404');
});

app.listen(port);
console.log('Site is listening on port ', port);