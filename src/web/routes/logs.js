const fs = require('fs');
const path = require('path');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  if (req.session.guildIds !== 'all') {
    req.session.message = 'Du bist dazu nicht berechtigt!';
    return res.redirect('/');
  }
  const logPath = path.join(__dirname, '../../../logs/bot._log');
  let logData = 'Keine Log-Datei gefunden.';
  if (fs.existsSync(logPath)) {
    logData = fs.readFileSync(logPath, 'utf8');
  }

  res.render('logs', { logData });
});
module.exports = router;
