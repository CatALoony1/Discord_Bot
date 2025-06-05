module.exports = async (interaction) => {
  if ((interaction.isStringSelectMenu() || interaction.isButton())) {
    console.log(`interaction ${interaction.customId} executed by ${interaction.member.user.tag}`);
  }
};