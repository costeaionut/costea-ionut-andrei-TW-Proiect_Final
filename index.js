const {
    query
} = require('express');
var express = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var app = express();
var port = process.env.PORT || 8000;

var dotenv = require('dotenv');

dotenv.config({
    path: './.env'
});

app.set('view engine', 'ejs');
app.use(express.static("public"));

var mysql = require('mysql')
const date_conectare = {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASS,
    database: process.env.DATABASE
}

app.use(express.urlencoded({
    extended: false
}));
app.use(express.json());

//Definim rutele proiectului
app.get('/', require('./routes/pages'));

app.get('/register', require('./routes/pages'));

app.get('/bazadate', require('./routes/pages'));

app.get('/meniu', require('./routes/pages'));

app.get('/paginaGrid', require('./routes/pages'));

app.post('/auth/register', (req, res) => {

    const { lName, fName, job, email, pass, conPass, picture } = req.body;

    var conexiune = mysql.createConnection(date_conectare);

    conexiune.query('SELECT email FROM heroku_a07b157368f36ae.utilizatori WHERE email=?;', [email], async (error, results) => {
        if (error) {
            console.log(error);
        }
        if (results.length > 0) {

            return res.render('pages/register', {
                message: "Adresa de email este deja folosită"
            });

        } else if (pass !== conPass) {

            return res.render('pages/register', {
                message: "Parolele nu corespund!"
            });

        }
        let hashedPassword = await bcrypt.hash(pass, 8);

        conexiune.query('INSERT INTO heroku_a07b157368f36ae.utilizatori SET ?', {
            email: email,
            nume: lName,
            prenume: fName,
            password: hashedPassword,
            job: job,
            poza: picture
        }, (error, result) => {
            if(error){
                console.log(error);
            }
            return res.render('pages/register', {
                message: "Utilizator înregistrat!"
            });
        });
    });
});

app.use(function (req, res, next) {
    res.status(404).render('pages/404');
});



app.listen(port);
console.log('Site is listening on port ', port);