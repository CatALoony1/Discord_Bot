const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, PermissionFlagsBits, SlashCommandBuilder, Client, Interaction, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pronounselect')
    .setDescription('Erzeugt Pronomensauswahl.').
    setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['He/him',
      'She/her',
      'They/them'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i]
      };
    };
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('pronounselect')
      .setPlaceholder('Pronomen auswählen')
      .setMinValues(0)
      .setMaxValues(rolenames.length)
      .addOptions(
        roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.value)
        )
      );
    const button = new ButtonBuilder()
      .setCustomId('removePronouns')
      .setLabel('Pronomensrolle entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle deine Pronomen.',
      components: [row, row2],
    });
  },
};