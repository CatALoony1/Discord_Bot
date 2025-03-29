const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('simulate-join')
    .setDescription('Simulate a member joining.')
    .addUserOption((option) =>
      option
        .setName('target-user')
        .setDescription('The user you want to emulate joining.')
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),

  /**
 * @param {import('commandkit').SlashCommandProps} param0
 */
  run: async ({ interaction, client }) => {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    if (interaction.user.id != process.env.ADMIN_ID) {
      await interaction.editReply('Du darfst das nicht!!!!');
      return;
    }
    console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
    const targetUser = interaction.options.getUser('target-user');

    let member;

    if (targetUser) {
      member =
        interaction.guild.members.cache.get(targetUser.id) ||
        (await interaction.guild.members.fetch(targetUser.id));
    } else {
      member = interaction.member;
    }

    client.emit('guildMemberAdd', member);

    await interaction.editReply('Simulated join!');
  },
  options: {
    devOnly: true,
    deleted: false,
  },
};