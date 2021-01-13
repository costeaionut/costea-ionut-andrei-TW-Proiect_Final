const {
    query
} = require('express');
var express = require('express');

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cookieParser = require('cookie-parser');

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
app.use(cookieParser());

//Definim rutele proiectului
app.get('/', require('./routes/pages'));

app.get('/register', require('./routes/pages'));

app.get('/login', require('./routes/pages'));

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

app.post('/auth/login', async (req, res) =>{
    
    const {email, pass} = req.body;
    var conexiune = mysql.createConnection(date_conectare);

    try {
        if ( !email || !pass ){
            return res.status(400).render('pages/login', {
                message: "Vă rugăm introduceți emailul și parola!"
            }) 
        }

    } catch (error) {
        console.log(error);
    }

    conexiune.query('SELECT * FROM heroku_a07b157368f36ae.utilizatori WHERE email = ?', [email], async (error, results) => {
        if(error){
            console.log(error);
        }

        console.log(await bcrypt.compare(pass, results[0].password))

        if (!results || (pass !== '123')){
            return res.status(401).render('pages/login', {
                message: "Datele introduse sunt greșite!"
            })
        } else {
            const id = results[0].email;

            ///Adăugat în baza de date un id care se modifică automat ca să îl luăm pe post de token id;

            const token = jwt.sign({id}, process.env.JWT_PASSWORD, {
                expiresIN: process.env.JWT_EXPIRES_IN
            }); 

            const cookieOptions = {
                expires: new Date(
                    Date.now() + process.env.JWT_COOKIE_EXPIRATION * 24 * 60 * 60 * 1000
                )
            }

            res.cookie('jwt', token, cookieOptions);
            res.status(200).redirect("/");
            
        }

    });

});

app.use(function (req, res, next) {
    res.status(404).render('pages/404');
});



app.listen(port);
console.log('Site is listening on port ', port);