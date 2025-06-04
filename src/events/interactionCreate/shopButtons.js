const { MessageFlags } = require('discord.js');
const createShopEmbeds = require("../../utils/createShopEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('shop')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [ , pageSlash] = targetMessageEmbed.title.split(" - ");
    let [page, maxpage] = pageSlash.split("/");
    if (interaction.customId === 'shopDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createShopEmbeds(newPage - 2, interaction)],
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
    } else if (interaction.customId === 'shopUp') {
        try {
            if (page != maxpage) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createShopEmbeds(newPage, interaction)],
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