const { MessageFlags } = require('discord.js');
const createLeaderboardEmbeds = require("../../utils/createLeaderboardEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('lPage')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [page, maxpage] = targetMessageEmbed.description.split("/");
    let [ , version] = targetMessageEmbed.title.split(" - ");
    if (interaction.customId === 'lPageDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage - 2, interaction, version)],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.reply({content:`Du bist bereits auf Seite 1.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'lPageUp') {
        try {
            if (page != maxpage) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createLeaderboardEmbeds(newPage, interaction, version)],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.reply({content:`Du bist bereits auf der letzten Seite.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};