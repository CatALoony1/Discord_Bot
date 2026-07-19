const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
  try {
    const client = req.discordClient;
    const servers = client.guilds.cache.map((guild) => ({
      id: guild.id,
      name: guild.name,
    }));
    const alleModelle = mongoose.modelNames();
    const selectedServerId = req.query.serverId;
    const selectedTable = req.query.table;
    let alleDaten = [];
    if (selectedServerId && selectedTable) {
      const DbModel = mongoose.models[selectedTable];
      if (!DbModel) {
        return res.status(404).json({ fehler: 'Tabelle existirt nicht.' });
      }
      const query = {};
      if (DbModel.schema.paths['guildId']) {
        query.guildId = selectedServerId;
      }
      alleDaten = await DbModel.find(query).select('-_id -__v').lean();
    }
    res.render('read-database', {
      servers: servers,
      selectedServerId: selectedServerId,
      alleDaten: alleDaten,
      tabellen: alleModelle,
      selectedTable: selectedTable,
      error: null,
    });
  } catch (error) {
    console.log(error);
    res.render('read-database', {
      servers: null,
      selectedServerId: null,
      alleDaten: null,
      tabellen: null,
      selectedTable: null,
      error: error.message,
    });
  }
});

module.exports = router;
