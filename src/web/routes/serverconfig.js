const express = require('express');
require('dotenv').config();
const router = express.Router();
const ServerConfig = require('../../models/ServerConfig');
const idUses = require('../../utils/data/idUses');
const Config = require('../../models/Config');

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
    let gifTextList = new Map();
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
        const cfg = await Config.find({
          guildId: selectedServerId,
        });
        for (const conf of cfg) {
          switch (conf.key) {
            case 'WELCOME_GIF':
              gifTextList = addToList(
                'WELCOME',
                conf.value,
                gifTextList,
                false,
              );
              break;
            case 'WELCOME_TXT':
              gifTextList = addToList('WELCOME', conf.value, gifTextList, true);
              break;
            case 'BYE_GIF':
              gifTextList = addToList('BYE', conf.value, gifTextList, false);
              break;
            case 'BYE_TXT':
              gifTextList = addToList('BYE', conf.value, gifTextList, true);
              break;
          }
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
      gifTextList: gifTextList,
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
      gifTextList: new Map(),
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
      gifTextList: new Map(),
    });
  }
});

router.post('/welcomemessage', async (req, res) => {
  const { giphyId, welcomeText, guildId } = req.body;
  const gifId = giphyId || '';
  const cfg = await Config.find({
    guildId: guildId,
    key: { $regex: '^WELCOME' },
  });
  let txtAdded = false;
  let gifAdded = false;
  if (cfg) {
    for (const conf of cfg) {
      if (conf.key === 'WELCOME_TXT') {
        conf.value = welcomeText;
        await conf.save();
        txtAdded = true;
      } else if (conf.key === 'WELCOME_GIF') {
        conf.value = gifId;
        await conf.save();
        gifAdded = true;
      }
    }
  }
  if (!gifAdded) {
    const newGifCfg = new Config({
      guildId: guildId,
      key: 'WELCOME_GIF',
      value: gifId,
    });
    await newGifCfg.save();
  }
  if (!txtAdded) {
    const newTxtCfg = new Config({
      guildId: guildId,
      key: 'WELCOME_TXT',
      value: welcomeText,
    });
    await newTxtCfg.save();
  }
  const targetUrl = guildId
    ? `/serverconfig?serverId=${guildId}`
    : '/serverconfig';
  return res.redirect(targetUrl);
});

router.post('/byemessage', async (req, res) => {
  const { giphyId, byeText, guildId } = req.body;
  const gifId = giphyId || '';
  const cfg = await Config.find({
    guildId: guildId,
    key: { $regex: '^BYE' },
  });
  let txtAdded = false;
  let gifAdded = false;
  if (cfg) {
    for (const conf of cfg) {
      if (conf.key === 'BYE_TXT') {
        conf.value = byeText;
        await conf.save();
        txtAdded = true;
      } else if (conf.key === 'BYE_GIF') {
        conf.value = gifId;
        await conf.save();
        gifAdded = true;
      }
    }
  }
  if (!gifAdded) {
    const newGifCfg = new Config({
      guildId: guildId,
      key: 'BYE_GIF',
      value: gifId,
    });
    await newGifCfg.save();
  }
  if (!txtAdded) {
    const newTxtCfg = new Config({
      guildId: guildId,
      key: 'BYE_TXT',
      value: byeText,
    });
    await newTxtCfg.save();
  }
  const targetUrl = guildId
    ? `/serverconfig?serverId=${guildId}`
    : '/serverconfig';
  return res.redirect(targetUrl);
});

function addToList(identifier, content, map, isTxt) {
  const entry = map.get(identifier);
  if (entry) {
    if (isTxt) {
      entry.text = content;
    } else {
      entry.gif = content;
    }
    map.set(identifier, entry);
  } else {
    if (isTxt) {
      map.set(identifier, { text: content, gif: '' });
    } else {
      map.set(identifier, { text: '', gif: content });
    }
  }
  return map;
}
module.exports = router;
