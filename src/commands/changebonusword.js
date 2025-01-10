const { SlashCommandBuilder, Interaction, InteractionContextType } = require('discord.js');
const Config = require('../models/Config');
require('dotenv').config();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('changebonusword')
    .setDescription('Tauscht Bonuswort aus')
    .addStringOption(option =>
      option.setName('oldword')
        .setMinLength(1)
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('newword')
        .setMinLength(1)
        .setRequired(true)
    )
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    if (interaction.user.id != process.env.ADMIN_ID) {
      interaction.reply('Du darfst das nicht!!!!');
      return;
    }
    let bonusWords = await Config.findOne({
      key: "bonusWords"
    });
    const oldWord = interaction.options.get('oldword').value;
    const newWord = interaction.options.get('newword').value;
    if (bonusWords.value.includes(oldWord)) {
      bonusWords.value = bonusWords.value.replace(oldWord, newWord);
      await bonusWords.save();
      console.log(`Word ${oldWord} replaced by ${newWord}.`);
      await interaction.reply({ content: `Wort ${oldWord} durch ${newWord} ersetzt.`, ephemeral: true });
    } else {
      await interaction.reply({ content: `Das Wort ist nicht vorhanden`, ephemeral: true });
    }
  },
};