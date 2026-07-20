const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const saltRounds = 10;
const WebUser = require('../../models/WebUser');

router.get('/', (req, res) => {
  res.render('jobs', {
    error: null,
    message: null,
  });
});

router.post('/change', async (req, res) => {
  const { oldpassword, password, confirm_password } = req.body;
  if (password === confirm_password) {
    try {
      const user = await WebUser.findById(req.session.userId);
      if (user && (await bcrypt.compare(oldpassword, user.password))) {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        user.password = hashedPassword;
        user.save();
        res.render('jobs', {
          error: null,
          messasge: 'Passwort erfolgreich geändert!',
        });
      } else {
        res.render('jobs', {
          error: 'Falsches altes Passwort!',
          message: null,
        });
      }
    } catch (error) {
      console.log(error);
      res.render('jobs', {
        error: error.message,
        message: null,
      });
    }
  } else {
    res.render('jobs', {
      error: 'Passwörter stimmen nicht überein.',
      message: null,
    });
  }
});

module.exports = router;
