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
    return res.render('serverconfig', {
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
    return res.render('serverconfig', {
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
    return res.render('serverconfig', {
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
  try {
    const { giphyId, welcomeText, guildId } = req.body;
    await addToDb(giphyId, welcomeText, guildId, 'WELCOME');
    const targetUrl = guildId
      ? `/serverconfig?serverId=${guildId}`
      : '/serverconfig';
    return res.redirect(targetUrl);
  } catch (error) {
    console.log(error);
    return res.render('serverconfig', {
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

router.post('/byemessage', async (req, res) => {
  try {
    const { giphyId, byeText, guildId } = req.body;
    await addToDb(giphyId, byeText, guildId, 'BYE');
    const targetUrl = guildId
      ? `/serverconfig?serverId=${guildId}`
      : '/serverconfig';
    return res.redirect(targetUrl);
  } catch (error) {
    console.log(error);
    return res.render('serverconfig', {
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

async function addToDb(giphyId, text, guildId, identifier) {
  const gifId = giphyId || '';
  const cfg = await Config.find({
    guildId: guildId,
    key: { $regex: `^${identifier}` },
  });
  let txtAdded = false;
  let gifAdded = false;
  if (cfg) {
    for (const conf of cfg) {
      if (conf.key === `${identifier}_TXT`) {
        conf.value = text;
        await conf.save();
        txtAdded = true;
      } else if (conf.key === `${identifier}_GIF`) {
        conf.value = gifId;
        await conf.save();
        gifAdded = true;
      }
    }
  }
  if (!gifAdded) {
    const newGifCfg = new Config({
      guildId: guildId,
      key: `${identifier}_GIF`,
      value: gifId,
    });
    await newGifCfg.save();
  }
  if (!txtAdded) {
    const newTxtCfg = new Config({
      guildId: guildId,
      key: `${identifier}_TXT`,
      value: text,
    });
    await newTxtCfg.save();
  }
}

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
