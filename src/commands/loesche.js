const { SlashCommandBuilder, PermissionFlagsBits, InteractionContextType, MessageFlags } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loesche')
    .setDescription('Loescht Nachrichten (max. 14 Tage alt).')
    .addIntegerOption(option =>
      option.setName('anzahl')
        .setDescription('Anzahl der zu loeschenden Nachrichten.')
        .setRequired(true)
        .setMaxValue(100)
        .setMinValue(1)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const amount = interaction.options.get('anzahl').value;
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });

    if (!amount) return interaction.editReply({ content: 'Du musst schon sagen wie viel ich löschen soll!' });
    if (isNaN(amount)) return interaction.editReply({ content: 'Es muss schon eine Zahl sein!' });
    if (amount > 100) return interaction.editReply({ content: 'Mehr als 100 Nachrichten, das pack ich nicht.' });
    if (amount < 1) return interaction.editReply({ content: '1 muss es doch schon mindestens sein' });

    try {
      var actualNumer = amount;
      await interaction.channel.messages.fetch({ limit: amount }).then(async messages => {
        let deletedMessages = await interaction.channel.bulkDelete(messages, true);
        actualNumer = deletedMessages.size;
      });
      await interaction.editReply({ content: `Ich habe mal ${actualNumer} Nachrichten gelöscht!` })
    } catch (error) {
      console.log(`There was an error when deleting Messages: ${error}`);
    }
  },
};