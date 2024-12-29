const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, ComponentType, PermissionFlagsBits, SlashCommandBuilder, Client, Interaction, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pingselect')
    .setDescription('Erzeugt Pingauswahl.')
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['Begrüßungskomitee',
      'Bump-Ping',
      'Event-Ping'];
    const emojis = ['👋', '👊', '📅'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i],
        emoji: emojis[i]
      };
    };
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('pingselect')
      .setPlaceholder('Rolle/n auswählen')
      .setMinValues(0)
      .setMaxValues(rolenames.length)
      .addOptions(
        roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.value)
            .setEmoji(role.emoji)
        )
      );

    const button = new ButtonBuilder()
      .setCustomId('removePingRoles')
      .setLabel('Pingrollen entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle aus, wann du gepingt werden möchtest.',
      components: [row, row2],
    });
  },
};