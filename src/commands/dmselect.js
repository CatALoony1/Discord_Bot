const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('dmselect')
    .setDescription('Erzeugt DMauswahl.').
    setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['DMs open',
      'DMs closed'];
    const emojis = ['🔓', '🔒'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i],
        emoji: emojis[i]
      };
    }
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('dmselect')
      .setPlaceholder('DMs offen/geschlossen?')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.value)
            .setEmoji(role.emoji)
        )
      );
    const button = new ButtonBuilder()
      .setCustomId('removeDm')
      .setLabel('DMrolle entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle aus, ob deine DMs offen oder geschlossen sind.',
      components: [row, row2],
    });
  },
};