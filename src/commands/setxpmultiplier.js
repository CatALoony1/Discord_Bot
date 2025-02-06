const { SlashCommandBuilder, Client, Interaction, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');
const Config = require("../models/Config");
module.exports = {
  data: new SlashCommandBuilder()
    .setName('setxpmultiplier')
    .setDescription('Setzt den Wert mit dem XP multipliziert werden.')
    .addIntegerOption(option =>
      option.setName('multiplier')
        .setDescription('Default = 1')
        .setRequired(true)
        .setMaxValue(4)
        .setMinValue(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const amount = interaction.options.get('multiplier').value;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    try {
      let confQuery = {
        key: "xpMultiplier"
      }
      let conf = await Config.findOne(confQuery);
      conf.value = amount;

      await conf.save().catch((e) => {
        console.log(`Error saving updated xpMultiplier ${e}`);
        return;
      });
      await interaction.editReply({ content: `XP-Multiplier auf ${amount} gesetzt!` })
    } catch (error) {
      console.log(`There was an error when setting xpMultiplier: ${error}`);
    }
  },
};
