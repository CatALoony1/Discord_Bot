const createLeaderboardEmbeds = require("../../utils/createLeaderboardEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId) return;
    if (interaction.customId === 'lPageDown') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != 1) {
                let newPage = +page;
                let embed = await createLeaderboardEmbeds(newPage - 2, interaction);
                await targetMessage.edit({
                    embeds: [embed],
                    components: [targetMessage.components[0]],
                    ephemeral: true
                })
                await interaction.deferUpdate();
                return;
            } else {
                interaction.reply({ content: `Du bist bereits auf Seite 1.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'lPageUp') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != maxpage) {
                let newPage = +page;
                let embeds = await createLeaderboardEmbeds(newPage, interaction);
                await targetMessage.edit({
                    embeds: [embeds],
                    components: [targetMessage.components[0]],
                    ephemeral: true
                })
                await interaction.deferUpdate();
                return;
            } else {
                interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};