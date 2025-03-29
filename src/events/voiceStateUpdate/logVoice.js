require('dotenv').config();
const { EmbedBuilder, VoiceState } = require('discord.js');
const { startVoiceXpJob, stopVoiceXpJob, isVoiceXpJobRunning } = require('../../utils/cronJob_voiceXp');

async function checkVoice(client) {
  await client.channels.cache.forEach(async (channel) => {
    var isTwoMembers = false;
    if (channel.type == 2 && channel.id != '1307820687599337602') {
      if (channel.members.size >= 2) {
        isTwoMembers = true;
      }
    }
    if (isTwoMembers) {
      if (!isVoiceXpJobRunning()) {
        startVoiceXpJob(client);
      }
    } else {
      if (isVoiceXpJobRunning()) {
        stopVoiceXpJob();
      }
    }
  });
}

/**
 * 
 * @param {VoiceState} oldState 
 * @param {VoiceState} newState 
 * @returns 
 */
module.exports = async (oldState, newState, client) => {
  try {
    const targetChannel = newState.guild.channels.cache.get(process.env.LOG_ID) || (await newState.guild.channels.fetch(process.env.LOG_ID));
    if (!targetChannel) {
      console.log('Fehler, Logchannel gibts nicht');
      return;
    }
    if (oldState.channel === newState.channel) return;
    const voiceUpdate = new EmbedBuilder();
    voiceUpdate.setAuthor({ name: newState.member.user.username, iconURL: newState.member.user.displayAvatarURL({ size: 256 }) });
    voiceUpdate.setTimestamp(Date.now());
    if (newState.channel === null) {
      console.log(`user ${newState.member.user.tag} left voicechannel ${oldState.channel}`);
      voiceUpdate.setColor(0xff0000);
      voiceUpdate.setTitle('Left Voicechannel');
      voiceUpdate.setDescription(`${oldState.channel}`);
    } else if (oldState.channel === null) {
      console.log(`user ${newState.member.user.tag} joined voicechannel ${newState.channel}`);
      voiceUpdate.setColor(0x008000);
      voiceUpdate.setTitle('Joined Voicechannel');
      voiceUpdate.setDescription(`${newState.channel}`);
    } else {
      console.log(`user ${newState.member.user.tag} moved voicechannels ${oldState.channel} to ${newState.channel}`);
      voiceUpdate.setColor(0x0033cc);
      voiceUpdate.setTitle('Moved Voicechannel');
      voiceUpdate.addFields({ name: 'von', value: `${oldState.channel}` });
      voiceUpdate.addFields({ name: 'nach:', value: `${newState.channel}` });
    }
    targetChannel.send({ embeds: [voiceUpdate] });
    await checkVoice(client);
  } catch (error) {
    console.log(error);
  }
};


