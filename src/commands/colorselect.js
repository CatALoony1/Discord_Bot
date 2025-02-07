const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('colorselect')
    .setDescription('Erzeugt Farbauswahl.').
    setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
    .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

  /**
   * 
   * @param {Object} param0 
   * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
   */
  run: async ({ interaction, client }) => {
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const rolenames = ['Hering Silber',
      'Thunfisch Grau',
      'Ozean-Türkis',
      'Kapitän Blau',
      'Lagunenblau',
      'Sturmbraus-Blau',
      'Marineblau',
      'Lachsrosa',
      'Krabbenrot',
      'Leuchtturm-Rot',
      'Fischernetz-Rostrot',
      'Voll Korall',
      'Zitronengelb',
      'Goldbarsch Gelb',
      'Panadegold',
      'Dillgrün',
      'Seegras-Grün',
      'Algen-Grün',
      'Tiefsee-Algen-Grün'];
    //const emojis = ['😬','😀','🤢','🥰','😑','😔','🥺','🤡','😖','🤑','😶‍🌫️','🤩','🤗','🤔','🥲','😎','😘','🤤','🥑'];
    const roles = [];
    for (let i = 0; i < rolenames.length; i++) {
      roles[i] = {
        label: rolenames[i],
        value: rolenames[i]//,
        //         emoji: emojis[i]
      };
    };
    const selectMenu = new StringSelectMenuBuilder()
      .setCustomId('colorselect')
      .setPlaceholder('Farbe auswählen')
      .setMinValues(1)
      .setMaxValues(1)
      .addOptions(
        roles.map((role) =>
          new StringSelectMenuOptionBuilder()
            .setLabel(role.label)
            .setValue(role.value)
          //        .setEmoji(role.emoji)
        )
      );
    const button = new ButtonBuilder()
      .setCustomId('removeColor')
      .setLabel('Farbrolle entfernen')
      .setStyle('Danger');
    const row = new ActionRowBuilder().addComponents(selectMenu);
    const row2 = new ActionRowBuilder().addComponents(button);
    const reply = await interaction.reply({
      content: 'Wähle eine Farbe.',
      components: [row, row2],
    });
  },
};