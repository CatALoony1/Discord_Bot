const Discord = require("discord.js");

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `whyleave-${interaction.user.tag}`) {
        const guild = await client.guilds.cache.get(process.env.GUILD_ID);
        var targetChannel = await guild.channels.fetch(process.env.LOG_ID);
        const grund = interaction.fields.getTextInputValue('whyleave-input');
        const leaveGrund = new Discord.EmbedBuilder();
        leaveGrund.setColor(0x0033cc);
        leaveGrund.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
        leaveGrund.setTitle(`Grund des verlassens:`);
        leaveGrund.setDescription(grund);
        await targetChannel.send({ embeds: [leaveGrund] });
        await interaction.reply('Danke für deine Rückmeldung!');
    }

};