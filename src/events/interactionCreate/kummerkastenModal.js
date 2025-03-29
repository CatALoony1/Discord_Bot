const Discord = require("discord.js");

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `feedback-${interaction.user.id}`) {
        const targetChannel = interaction.guild.channels.cache.get(process.env.KUMMERKASTEN_ID) || (await interaction.guild.channels.fetch(process.env.KUMMERKASTEN_ID));
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
        const feedbackText = interaction.fields.getTextInputValue('feedback-input');
        const feedback = new Discord.EmbedBuilder();
        feedback.setColor(0x0033cc);
        feedback.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
        feedback.setTimestamp(Date.now());
        feedback.setTitle(`Neue Kummerkasten Nachricht`);
        feedback.setDescription(feedbackText);
        await targetChannel.send({ embeds: [feedback] });
        interaction.editReply('Nachricht eingeworfen!');
    }
};