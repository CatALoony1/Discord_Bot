const { MessageFlags } = require('discord.js');
const createShopEmbeds = require("../../utils/createShopEmbeds");
const GameUser = require('../../models/GameUser');
require('../../models/Bankkonten');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('shop')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [, pageSlash] = targetMessageEmbed.title.split(" - ");
    let [page, maxpage] = pageSlash.split("/");
    if (interaction.customId === 'shopDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                await interaction.update({
                    embeds: [await createShopEmbeds(newPage - 2, interaction)],
                    components: [targetMessage.components[0], targetMessage.components[1]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf Seite 1.`, flags: MessageFlags.Ephemeral });
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
                    components: [targetMessage.components[0], targetMessage.components[1]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'shopBuy') {
        try {
            const description = targetMessageEmbed.description;
            const itemName = description.substring(description.indexOf('Name:') + 6, description.indexOf('\n'));
            const price = parseInt(description.substring(description.indexOf('Preis:') + 7, description.indexOf('Loserlinge') -1));
            console.log(`Item: ${itemName}, Price: ${price}`);
            const user = await GameUser.findOne({ userId: interaction.user.id }).populate('bankkonto');
            if (!user || !user.bankkonto) {
                await interaction.reply({ content: 'Du hast kein Bankkonto!', flags: MessageFlags.Ephemeral });
                return;
            }
            if (user.bankkonto.currentMoney < price) {
                await interaction.reply({ content: 'Du hast nicht genug Geld auf deinem Bankkonto!', flags: MessageFlags.Ephemeral });
                return;
            }
            return;
        } catch (error) {
            console.log(error);
        }
    }
};