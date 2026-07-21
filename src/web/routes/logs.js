const fs = require('fs');
const path = require('path');

app.get('/logs', requireLogin, (req, res) => {
  const logPath = path.join(__dirname, '../../../logs/bot._log');
  let logData = 'Keine Log-Datei gefunden.';
  if (fs.existsSync(logPath)) {
    logData = fs.readFileSync(logPath, 'utf8');
  }

  res.render('logs', { logData });
});
