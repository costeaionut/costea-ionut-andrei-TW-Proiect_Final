var express = require('express');

var mysql = require('mysql')

var router = express.Router();

const date_conectare = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
}

router.get('/', function (req, res) {
    res.render('pages/home', {activ: 'acasa'});
});

router.get('/register', function (req, res) {
    res.render('pages/register');
});

router.get('/login', function (req, res) {
    res.render('pages/login');
});

router.get('/bazadate', function (req, res) {

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

router.get('/meniu', function (req, res) {
    res.render('pages/meniu', {activ: 'meniu'});
});

router.get('/paginaGrid', function (req, res) {
    res.render('pages/paginaGrid', {activ: 'grid'});
});

module.exports = router;