const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ageselect')
    .setDescription('Erzeugt Altersauswahl.').
    setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['<18',
      '18-21',
      '22-25',
      '26-29',
      'Ü 30'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i]
      };
    };
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('ageselect')
      .setPlaceholder('Alter auswählen')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.value)
        )
      );
    const button = new ButtonBuilder()
      .setCustomId('removeAge')
      .setLabel('Altersrolle entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle ein Alter.',
      components: [row, row2],
    });
  },
};