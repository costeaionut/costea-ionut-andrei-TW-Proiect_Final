// load the things we need
var express = require('express');
var app = express();

var mysql = require('mysql')

// set the port we are listening on
var port = process.env.PORT || 8000;

// set the view engine to ejs
app.set('view engine', 'ejs');
app.use(express.static("public"));

// use res.render to load up an ejs view file

var conexiune = mysql.createConnection({
    host: "eu-cdbr-west-03.cleardb.net",
    user: "be5df639565f3a",
    password: "69da649c",
    database: "heroku_a07b157368f36ae"
});

conexiune.connect(function(err){
    if(err) throw err;
    console.log("Lesgo");
});

// index page
app.get('/', function(req, res) {
    res.render('pages/home');
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