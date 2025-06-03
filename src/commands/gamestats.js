const { SlashCommandBuilder, InteractionContextType, EmbedBuilder } = require('discord.js');
const Lottozahlen = require('../models/Lottozahlen');
const GameUser = require('../models/GameUser');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('gamestats')
    .setDescription('Zeigt all deine Level-Bezogenen Daten.')
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (!interaction.inGuild()) {
      interaction.reply('Hier ist doch kein Server!');
      return;
    }

    await interaction.deferReply();
    const targetUserId = interaction.member.id;
    const user = await GameUser.findOne({
      userId: targetUserId,
      guildId: interaction.guild.id,
    }).populate('bankkonto').populate('inventar').populate('tiere');

    if (!user) {
      interaction.editReply("Du hast noch kein Level");
      return;
    }

    let allUsers = await GameUser.find({ guildId: interaction.guild.id }).populate('bankkonto');

    var oldUsers = [];
    for (let j = 0; j < allUsers.length; j++) {
      if (!(interaction.guild.members.cache.find(m => m.id === allUsers[j].userId)?.id)) {
        oldUsers[oldUsers.length] = j;
      }
    }
    for (let j = 0; j < oldUsers.length; j++) {
      allUsers.splice(oldUsers[j] - j, 1);
    }

    allUsers.sort((a, b) => {
      return b.bankkonto.currentMoney - a.bankkonto.currentMoney;
    });
    let currentRank = allUsers.findIndex((usr) => usr.userId === targetUserId) + 1;
    let lotto = await Lottozahlen.find({
      guildId: interaction.guild.id,
      userId: targetUserId,
    });
    var lottospiele = 0;
    if (lotto && lotto.length > 0) {
      lottospiele = lotto.length;
    }
    const messageEdited = new EmbedBuilder();
    messageEdited.setColor(0x0033cc);
    messageEdited.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ size: 256 }) });
    messageEdited.setTitle(`Deine Stats:`);
    messageEdited.addFields({ name: 'Rang:', value: `${currentRank}` });
    messageEdited.addFields({ name: 'Aktuelle Loserlinge:', value: `${user.bankkonto.currentMoney}` });
    messageEdited.addFields({ name: 'Verlorene/Ausgegebene Loserlinge:', value: `${user.bankkonto.moneyGain}` });
    messageEdited.addFields({ name: 'Erhaltene Loserlinge:', value: `${user.bankkonto.moneyLost}` });
    messageEdited.addFields({ name: 'Anzahl Lottospiele:', value: `${lottospiele}` });
    messageEdited.addFields({ name: 'Quizspiele hinzugefügt:', value: `${user.quizadded}` });
    messageEdited.addFields({ name: 'Inventar', value: `${user.inventar.items}` });
    messageEdited.addFields({ name: 'Tiere', value: `${user.tiere}` });
    interaction.editReply({ embeds: [messageEdited] });
  },
  options: {
    devOnly: false,
    deleted: false
  },
};