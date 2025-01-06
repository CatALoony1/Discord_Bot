const createQuizLeaderboardEmbeds = require("../../utils/createQuizLeaderboardEmbeds");

module.exports = async (interaction, client) => {
    if (!interaction.isButton() || !interaction.customId) return;
    if (interaction.customId === 'qPageDown') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createQuizLeaderboardEmbeds(newPage - 2, client)],
                    components: [targetMessage.components[0]]
                })
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf Seite 1.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'qPageUp') {
        try {
            let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            let targetMessageEmbed = targetMessage.embeds[0];
            let [page, maxpage] = targetMessageEmbed.description.split("/");
            if (page != maxpage) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createQuizLeaderboardEmbeds(newPage, client)],
                    components: [targetMessage.components[0]]
                })
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, ephemeral: true });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};