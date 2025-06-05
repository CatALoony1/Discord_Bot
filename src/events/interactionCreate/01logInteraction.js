module.exports = async (interaction) => {
  if ((interaction.isStringSelectMenu() || interaction.isButton()) && interaction.customId.startsWith('abcde_')) {
    console.log(`interaction ${interaction.customId} executed by ${interaction.member.user.tag}`);
  }
};