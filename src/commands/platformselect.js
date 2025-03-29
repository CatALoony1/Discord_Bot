const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('platformselect')
    .setDescription('Erzeugt Plattformauswahl.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['XBOX',
      'Switch',
      'PC',
      'Playstation',
      'Mobile'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i]
      };
    }
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('platformselect')
      .setPlaceholder('Plattform/en auswählen')
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
      .setCustomId('removePlatformRoles')
      .setLabel('Plattformrollen entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    await interaction.reply({
      content: 'Wähle aus, welche Plattformen du nutzt.',
      components: [row, row2],
    });
  },
};