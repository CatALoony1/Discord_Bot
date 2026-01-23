const {
  SlashCommandBuilder,
  InteractionContextType,
  PermissionFlagsBits,
  MessageFlags,
} = require('discord.js');
const Config = require('../models/Config');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('informed-inactive')
    .setDescription('Setzt User beim Inaktivitäts-Check aus.')
    .addSubcommand((subcommand) =>
      subcommand
        .setName('add')
        .setDescription('Setzt Nutzer inaktiv.')
        .addUserOption((option) =>
          option.setName('nutzer').setDescription('Nutzer').setRequired(true),
        ),
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName('remove')
        .setDescription('Entfernt Nutzer inaktiv.')
        .addUserOption((option) =>
          option.setName('user').setDescription('Nutzer').setRequired(true),
        ),
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),

  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (!interaction.inGuild()) {
      interaction.editReply('Hier ist doch kein Server!');
      return;
    }
    const targetUserId =
      interaction.options.get('nutzer')?.value ||
      interaction.options.get('user')?.value;
    const subcommand = interaction.options.getSubcommand();
    if (
      !interaction.guild.members.cache.find((m) => m.id === targetUserId)?.id
    ) {
      interaction.editReply(
        `Bei ${targetUserId} handelt es sich nicht um einen Nutzer.`,
      );
      return;
    }
    const targetUserObj = await interaction.guild.members.fetch(targetUserId);
    const config = await Config.findOne({
      key: 'away',
      guildId: interaction.guild.id,
    });
    if (subcommand == 'add') {
      if (config.value.includes(targetUserObj.user.tag)) {
        await interaction.editReply(
          `Der User ${targetUserObj.user.tag} ist bereits einetragen.`,
        );
      } else {
        if (config.value.length >= 1) {
          config.value = `${config.value},${targetUserObj.user.tag}`;
        } else {
          config.value = `${targetUserObj.user.tag}`;
        }
        await config.save();
        await interaction.editReply(
          `Der User ${targetUserObj.user.tag} wurde einetragen.`,
        );
      }
    } else if (subcommand == 'remove') {
      if (config.value.includes(targetUserObj.user.tag)) {
        let away = config.value.split(',');
        away.splice(away.indexOf(targetUserObj.user.tag), 1);
        config.value = away.toString();
        await config.save();
        await interaction.editReply(
          `Der User ${targetUserObj.user.tag} wurde entfernt.`,
        );
      } else {
        await interaction.editReply(
          `Der User ${targetUserObj.user.tag} ist gar nicht einetragen.`,
        );
      }
    }
  },
};
