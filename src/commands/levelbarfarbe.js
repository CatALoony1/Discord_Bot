const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const Level = require('../models/Level');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('levelbarfarbe')
    .setDescription('Wahle die Farbe deiner Levelfortschrittsleiste aus.')
    .addStringOption(option =>
      option.setName('farbe')
        .setDescription('Hashcode der Farbe(mit #).')
        .setMinLength(7)
        .setMaxLength(7)
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
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const farbe = interaction.options.get('farbe').value;
    const hexregex = /^#(?:[0-9a-fA-F]{3}){1,2}$/;
    if (farbe.match(hexregex)) {
      const query = {
        userId: interaction.user.id,
        guildId: interaction.guild.id,
      };
      try {
        const level = await Level.findOne(query);
        if (level) {
          level.color = farbe;
          await level.save().catch((e) => {
            console.log(`Error saving updated level ${e}`);
            return;
          });
          await interaction.editReply(`Farbe erfolgreich geaendert.`);
        } else {
          await interaction.editReply(`Du bist noch nicht in der DB, chatte mal bisschen.`);
        }
      } catch (error) {
        console.log(error);
      }
    } else {
      await interaction.editReply(`Der eingegebene Wert muss ein Hex-Farbcde sein Bsp.: #1f7da2`);
    }
  },
};