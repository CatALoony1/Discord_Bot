const { MessageFlags } = require('discord.js');
const createShopEmbeds = require("../../utils/createShopEmbeds");
const GameUser = require('../../models/GameUser');
require('../../models/Bankkonten');
require('../../models/Inventar');
const Items = require('../../models/Items');
const removeMoney = require('../../utils/removeMoney');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('useItem')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [, pageSlash] = targetMessageEmbed.title.split(" - ");
    let [page, maxpage] = pageSlash.split("/");
    if (interaction.customId === 'shopDown') {
        try {

            
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'shopUp') {
        try {

        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'shopBuy') {
        try {

        } catch (error) {
            console.log(error);
        }
    }
};