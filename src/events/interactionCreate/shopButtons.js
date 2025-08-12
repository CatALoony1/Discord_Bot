const { MessageFlags, ButtonBuilder, ActionRowBuilder } = require('discord.js');
const createShopEmbeds = require("../../utils/createShopEmbeds");
const removeMoney = require('../../utils/removeMoney');
require('dotenv').config();
const { getDaos } = require('../../utils/daos');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('shop')) return;
    const { bankkontenDAO, inventarDAO, itemsDAO } = getDaos();
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [, pageSlash] = targetMessageEmbed.title.split(" - ");
    let [currentPage, maxPage] = pageSlash.split("/");
    currentPage = parseInt(currentPage);
    maxPage = parseInt(maxPage);
    if (interaction.customId === 'shopDown') {
        try {
            let newPage;
            if (currentPage === 1) {
                newPage = maxPage;
            } else {
                newPage = currentPage - 1;
            }
            await interaction.update({
                embeds: [await createShopEmbeds(newPage - 1, interaction)],
                components: [targetMessage.components[0], targetMessage.components[1]]
            });
            return;
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'shopUp') {
        try {
            let newPage;
            if (currentPage === maxPage) {
                newPage = 1;
            } else {
                newPage = currentPage + 1;
            }
            await interaction.update({
                embeds: [await createShopEmbeds(newPage - 1, interaction)],
                components: [targetMessage.components[0], targetMessage.components[1]]
            });
            return;
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'shopBuy') {
        try {
            const description = targetMessageEmbed.description;
            const itemName = description.substring(description.indexOf('Name:') + 6, description.indexOf('\n'));
            const price = parseInt(description.substring(description.indexOf('Preis:') + 7, description.indexOf('Blattläuse') - 1).replaceAll('.', ''));
            console.log(`Item: ${itemName}, Price: ${price}`);
            const bankkonto = await bankkontenDAO.getOneByUserAndGuild(interaction.user.id, interaction.guild.id);
            if (!bankkonto || !bankkonto.besitzerObj) {
                await interaction.reply({ content: 'Du hast kein Bankkonto!', flags: MessageFlags.Ephemeral });
                return;
            }
            if (bankkonto.currentMoney < price) {
                await interaction.reply({ content: 'Du hast nicht genug Blattläuse auf deinem Bankkonto!', flags: MessageFlags.Ephemeral });
                return;
            }
            const inventar = await inventarDAO.getOneByBesitzer(bankkonto.besitzerObj._id);
            if (!itemName.includes('Keks')) {
                const item = await itemsDAO.getOneByName(itemName);
                if (!item) {
                    await interaction.reply({ content: `Das Item ${itemName} existiert nicht!`, flags: MessageFlags.Ephemeral });
                    return;
                }
                const itemIndex = inventar.items.findIndex(inventarItem => inventarItem.itemObj._id.equals(item._id));
                if (itemIndex !== -1) {
                    inventar.items[itemIndex].quantity += 1;
                    await inventarDAO.update(inventar);
                    await interaction.reply({ content: `Du hast ein ${itemName} gekauft!`, flags: MessageFlags.Ephemeral });
                } else {
                    inventar.items.push({ itemId: item._id, quantity: 1, itemObj: item });
                    await inventarDAO.update(inventar);
                    await interaction.reply({ content: `Du hast ein ${itemName} gekauft!`, flags: MessageFlags.Ephemeral });
                }
            } else {
                const booster = interaction.member.roles.cache.some(role => role.name === 'Server Booster') ? true : false;
                let amount = price;
                if (booster) {
                    amount = Math.floor(amount * 100 / 90);
                }
                const item = await itemsDAO.getOneByName('Keks');
                if (!item) {
                    await interaction.reply({ content: `Das Item Keks existiert nicht!`, flags: MessageFlags.Ephemeral });
                    return;
                }
                const itemIndex = inventar.items.findIndex(inventarItem => inventarItem.itemObj._id.equals(item._id));
                if (itemIndex !== -1) {
                    inventar.items[itemIndex].quantity += amount;
                } else {
                    inventar.items.push({ itemId: item._id, quantity: amount, itemObj: item });
                }
                await inventarDAO.update(inventar);
                const useButton = new ButtonBuilder()
                    .setCustomId(`useItem_selectMenu_${itemName}`)
                    .setLabel('Item benutzen')
                    .setStyle('Primary');
                const firstRow = new ActionRowBuilder().addComponents(useButton);
                await interaction.reply({ content: `Du hast ein ${itemName} gekauft!`, flags: MessageFlags.Ephemeral, components: [firstRow] });
            }
            await removeMoney(interaction.member, price);
            return;
        } catch (error) {
            console.log(error);
        }
    }
};