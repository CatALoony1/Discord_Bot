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
    let channels = [];
    if (selectedServerId && selectedTable) {
      const dbModel = mongoose.models[selectedTable];
      if (!dbModel) {
        return res.status(404).json({ fehler: 'Tabelle existirt nicht.' });
      }
      const query = {};
      if (dbModel.schema.paths['guildId']) {
        query.guildId = selectedServerId;
      }
      const alleDaten = await DbModel.find(suchFilter).lean();
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
      servers: servers,
      selectedServerId: selectedServerId,
      alleDaten: null,
      tabellen: alleModelle,
      selectedTable: selectedTable,
      error: error.message,
    });
  }
});

module.exports = router;
