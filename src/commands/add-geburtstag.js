const {
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
} = require('discord.js');
const Level = require('../models/Level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('add-geburtstag')
    .setDescription('Trage deinen Geburtstag ein.')
    .addIntegerOption((option) =>
      option
        .setName('tag')
        .setDescription('Tag des Geburtstags.')
        .setRequired(true)
        .setMaxValue(31)
        .setMinValue(1),
    )
    .addIntegerOption((option) =>
      option
        .setName('monat')
        .setDescription('Monat des Geburtstags.')
        .setRequired(true)
        .setMaxValue(12)
        .setMinValue(1),
    )
    .addIntegerOption((option) =>
      option
        .setName('jahr')
        .setDescription('Jahr des Geburtstags.')
        .setRequired(true)
        .setMaxValue(new Date().getFullYear())
        .setMinValue(1900),
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),
  /**
   *
   * @param {Object} param0
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const tag = interaction.options.get('tag').value;
    const monat = interaction.options.get('monat').value;
    const jahr = interaction.options.get('jahr').value;
    if (
      tag >= 1 &&
      tag <= 31 &&
      monat >= 1 &&
      monat <= 12 &&
      jahr >= 1900 &&
      jahr <= new Date().getFullYear()
    ) {
      const geburtstag = new Date(jahr, monat - 1, tag);
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };
      try {
        const level = await Level.findOne(query);
        if (level) {
          level.geburtstag = geburtstag;
          await level.save().catch((e) => {
            console.log(`Error saving updated geburtstag ${e}`);
            return;
          });
          await interaction.editReply(`Geburtstag erfolgreich eingetragen.`);
        } else {
          await interaction.editReply(
            `Du bist noch nicht in der DB, chatte mal bisschen.`,
          );
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await interaction.editReply(
        `Der eingegebene Wert muss ein gültiges Datum sein.`,
      );
    }
  },
};
