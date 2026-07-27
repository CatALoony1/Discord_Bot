const express = require('express');
require('dotenv').config();
const router = express.Router();
const ServerConfig = require('../../models/ServerConfig');
const idUses = require('../../utils/data/idUses');

router.get('/', async (req, res) => {
  try {
    const client = req.discordClient;
    let servers = client.guilds.cache.map((guild) => ({
      id: guild.id,
      name: guild.name,
    }));
    const allowedGuilds = req.session.guildIds;
    if (allowedGuilds !== 'all') {
      const allowedIds = allowedGuilds.split(',').map((id) => id.trim());
      servers = servers.filter((server) => allowedIds.includes(server.id));
    }
    let rollen = [];
    let defaultRole = '';
    const selectedServerId = req.query.serverId || servers[0]?.id;
    if (selectedServerId) {
      const selectedGuild = client.guilds.cache.get(selectedServerId);
      if (selectedGuild) {
        rollen = selectedGuild.roles.cache.map((role) => ({
          id: role.id,
          name: role.name,
        }));
        const srvCfg = await ServerConfig.findOne({
          guildId: selectedServerId,
          variableName: 'MITGLIED_ROLE_ID',
        }).lean();
        if (srvCfg) {
          defaultRole = srvCfg.objectId;
        }
      }
    }
    res.render('serverconfig', {
      servers: servers,
      selectedServerId: selectedServerId,
      alleRollen: rollen,
      defaultRole: defaultRole,
      uses: idUses,
      error: null,
      giphyApiKey: process.env.GIPHY_API,
    });
  } catch (error) {
    console.log(error);
    res.render('serverconfig', {
      servers: null,
      selectedServerId: null,
      alleRollen: [],
      defaultRole: '',
      uses: idUses,
      error: error.message,
      giphyApiKey: process.env.GIPHY_API,
    });
  }
});

router.post('/change-member-role', async (req, res) => {
  try {
    const guildId = req.body.guildId;
    let roleId = req.body.newMemberRole;
    const targetUrl = guildId
      ? `/serverconfig?serverId=${guildId}`
      : '/serverconfig';
    const srvConf = await ServerConfig.findOne({
      guildId: guildId,
      variableName: 'MITGLIED_ROLE_ID',
    });
    if (srvConf && srvConf.objectId != roleId) {
      srvConf.objectId = roleId;
      await srvConf.save();
    } else {
      const newSrvConf = new ServerConfig({
        guildId: guildId,
        variableName: 'MITGLIED_ROLE_ID',
        objectId: roleId,
      });
      newSrvConf.save();
    }
    return res.redirect(targetUrl);
  } catch (error) {
    console.log(error);
    res.render('serverconfig', {
      servers: null,
      selectedServerId: null,
      alleRollen: [],
      defaultRole: '',
      uses: idUses,
      error: error.message,
      giphyApiKey: process.env.GIPHY_API,
    });
  }
});

router.post('/welcomegif', (req, res) => {
  const { giphyId } = req.body;
  console.log('Ausgewählte Giphy ID:', giphyId);
});

module.exports = router;
