const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('regionselect')
    .setDescription('Erzeugt Bundeslandsauswahl.').
    setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['Niedersachsen',
      'Bayern',
      'Berlin',
      'Hessem',
      'Thüringen',
      'Bremen',
      'Baden-Württemberg',
      'Saarland',
      'Sachsen',
      'Sachsen-Anhalt',
      'Mecklenburg-Vorpommern',
      'Brandenburg',
      'Schleswig-Holstein',
      'Nordrhein-Westfalen',
      'Hamburg',
      'Rheinland-Pfalz'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i]
      };
    };
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('regionselect')
      .setPlaceholder('Bundesland auswählen')
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
      .setCustomId('removeRegion')
      .setLabel('Bundesland entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle dein Bundesland.',
      components: [row, row2],
    });
  },
};