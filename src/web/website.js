require('dotenv').config();
const express = require('express');
const session = require('express-session');
const calculatorRouter = require('./routes/calculator');
const channelsRouter = require('./routes/channels');
const app = express();
const port = 3000;
const ADMIN_PASSWORD = process.env.PWD;

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.WEBSECRET,
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  }),
);

function requireLogin(req, res, next) {
  if (req.session.loggedIn) {
    next();
  } else {
    res.redirect('/login');
  }
}

function startWebsite(client) {
  app.use((req, res, next) => {
    req.discordClient = client;
    next();
  });
  app.get('/login', (req, res) => {
    res.render('login');
  });
  app.post('/login', (req, res) => {
    const submittedPassword = req.body.password;

    if (submittedPassword === ADMIN_PASSWORD) {
      req.session.loggedIn = true;
      res.redirect('/');
    } else {
      res.render('login', { error: 'Falsches Passwort!' });
    }
  });
  app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/login');
  });

  //geschützte routen
  app.get('/', requireLogin, (req, res) => {
    res.render('index', {
      botStatus: 'Test-Modus aktiv',
    });
  });
  app.use('/rechner', requireLogin, calculatorRouter);
  app.use('/kanaele', requireLogin, channelsRouter);

  app.listen(port, () => {
    console.log(`[Dashboard] Webserver läuft auf http://localhost:${port}`);
  });
}

module.exports = { startWebsite };
