const {
    query
} = require('express');
var express = require('express');

var app = express();
var mysql = require('mysql')
var port = process.env.PORT || 8000;

app.set('view engine', 'ejs');
app.use(express.static("public"));


const date_conectare = {
    host: "eu-cdbr-west-03.cleardb.net",
    user: "be5df639565f3a",
    password: "69da649c",
    database: "heroku_a07b157368f36ae"
}

app.get('/', function (req, res) {
    res.render('pages/home', {activ: 'acasa'});
});

app.get('/bazadate', function (req, res) {

    var conexiune = mysql.createConnection(date_conectare);

    conexiune.connect(function (err) {
        if (err) throw err;
        console.log("Lesgo");
    });

    var nume = req.query.nume;
    var pret = req.query.pret;
    var tip = req.query.tip;
    var vegan = req.query.vegan;

    var nume_statement = "";
    var pret_statement = "";
    var tip_statement = "";
    var vegan_statement = "";

    if (nume !== '') nume_statement = ` and nume_produs = '${nume}'`;
    if (pret !== undefined) pret_statement = ` and pret < ${pret}`;
    if (tip !== undefined) tip_statement = ` and categorie = '${tip}'`;
    if (vegan !== undefined) vegan_statement = ` and vegan = true`;

    var database = date_conectare.database
    const partial_query = 'select nume_produs, descriere_produs, categorie, pret, DATE_FORMAT(DATE_INTRODUCERE, "%d %M  %Y") as `DATE_FORMAT`, vegan, imagine from ' + database + ".produse where" + nume_statement + tip_statement + pret_statement + vegan_statement + ";";
    var query = partial_query.replace(' and', '');

    conexiune.query(query, function (err, rezultate, campuri) {
        if (err) throw err;
        console.log(rezultate)
        res.render('pages/baza_date', {
            produse: rezultate,
            activ: 'bazadate'
        });
        
    })
    conexiune.end()
});

app.get('/meniu', function (req, res) {
    res.render('pages/meniu', {activ: 'meniu'});
});

app.get('/paginaGrid', function (req, res) {
    res.render('pages/paginaGrid', {activ: 'grid'});
});

app.use(function (req, res, next) {
    res.status(404).render('pages/404');
});

app.listen(port);
console.log('Site is listening on port ', port);