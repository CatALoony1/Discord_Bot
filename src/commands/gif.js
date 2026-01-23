const {
  SlashCommandBuilder,
  InteractionContextType,
  MessageFlags,
} = require('discord.js');
const getTenorGif = require('../utils/getTenorGif');
module.exports = {
  data: new SlashCommandBuilder()
    .setName('gif')
    .setDescription('Sendet ein zufälliges GIF zu einem Begriff.')
    .addStringOption((option) =>
      option
        .setName('suchwort')
        .setDescription('Suchwort')
        .setMinLength(1)
        .setRequired(true),
    )
    .setContexts([
      InteractionContextType.Guild,
      InteractionContextType.PrivateChannel,
    ]),

  run: async ({ interaction }) => {
    console.log(
      `SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`,
    );
    await interaction.deferReply();
    const suchwort = interaction.options.get('suchwort').value;
    const regex =
      /^[\u0041-\u005A\u0061-\u007A\u00C4\u00D6\u00DC\u00E4\u00F6\u00FC\u00DF\s]+$/; // A-Z, a-z, ÄÖÜäöü, ß
    if (!regex.test(suchwort)) {
      await interaction.deferReply({ flags: MessageFlags.Ephemeral });
      await interaction.editReply(
        'Das übergebene Wort enthält Zeichen die nicht zugelassen sind.',
      );
      return;
    }
    try {
      const response = await getTenorGif(suchwort);
      await interaction.editReply(response);
    } catch (error) {
      console.log(error);
    }
  },
};
