const { MessageFlags, StringSelectMenuBuilder, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const GameUser = require('../../models/GameUser');
require('../../models/Bankkonten');
require('../../models/Inventar');
require('../../models/Items');
const Tiere = require('../../models/Tiere');

module.exports = async (interaction) => {
    if (!interaction.customId || !interaction.customId.includes('useItem')) return;
    if (interaction.isButton()) {
        if (interaction.customId.includes('tier')) {
            const targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
            if (interaction.customId.includes('self_select')) {
                const tierart = interaction.values[0];
                const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
                const randomTierOhneBesitzer = await getRandomTier(tierart);
                if (randomTierOhneBesitzer.length === 0) {
                    await targetMessage.edit({
                        content: 'Es gibt leider keine verfügbaren Tiere dieser Art!', components: [],
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                randomTierOhneBesitzer[0].besitzer = user._id;
                await randomTierOhneBesitzer[0].save();
                const itemId = user.inventar.items.findIndex(item => item.item.name === 'Tier');
                if (user.inventar.items[itemId].quantity > 1) {
                    user.inventar.items[itemId].quantity -= 1;
                } else {
                    user.inventar.items.splice(itemId, 1);
                }
                await user.inventar.save();
                await targetMessage.edit({
                    content: `Du hast erfolgreich ein Tier der Art **${tierart}** mit dem tollen namen **${randomTierOhneBesitzer[0].pfad}** erhalten!`,
                    files: [`./animals/${randomTierOhneBesitzer[0].pfad}.webp`],
                    components: [],
                    flags: MessageFlags.Ephemeral
                });
            } else if (interaction.customId.includes('other_select')) {
                const targetUser = interaction.values[0];
                const tierarten = await getTierarten();
                if (tierarten.tierarten.length === 0) {
                    await targetMessage.edit({
                        content: 'Es gibt leider keine verfügbaren Tiere!', components: [],
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId(`useItem_tier_other_uselect_${targetUser}`)
                    .setPlaceholder('Wähle ein Tier aus')
                    .addOptions(tierarten.tierarten.map(tierart => ({
                        label: tierart,
                        value: tierart
                    })));
                const row = new ActionRowBuilder().addComponents(selectMenu);
                await targetMessage.edit({
                    content: 'Wähle ein Tier aus, das du besitzen möchtest:',
                    components: [row],
                    flags: MessageFlags.Ephemeral
                });
            } else if (interaction.customId.includes('other_uselect')) {
                const tierart = interaction.values[0];
                const targetUserId = interaction.customId.split('_')[4];
                const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
                const randomTierOhneBesitzer = await getRandomTier(tierart);
                if (randomTierOhneBesitzer.length === 0) {
                    await targetMessage.edit({
                        content: 'Es gibt leider keine verfügbaren Tiere dieser Art!', components: [],
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                randomTierOhneBesitzer[0].besitzer = user._id;
                await randomTierOhneBesitzer[0].save();
                const itemId = user.inventar.items.findIndex(item => item.item.name === 'Tier');
                if (user.inventar.items[itemId].quantity > 1) {
                    user.inventar.items[itemId].quantity -= 1;
                } else {
                    user.inventar.items.splice(itemId, 1);
                }
                await user.inventar.save();
                await targetMessage.edit({
                    content: `Du hast erfolgreich ein Tier der Art **${tierart}** mit dem tollen namen **${randomTierOhneBesitzer[0].pfad}** an <@${targetUserId}> verschenkt!`,
                    files: [`./animals/${randomTierOhneBesitzer[0].pfad}.webp`],
                    components: [],
                    flags: MessageFlags.Ephemeral
                });
            } else if (interaction.customId.includes('self')) {
                const tierarten = await getTierarten();
                console.log(tierarten);
                if (tierarten.length === 0) {
                    await targetMessage.edit({
                        content: 'Es gibt leider keine verfügbaren Tiere!', components: [],
                        flags: MessageFlags.Ephemeral
                    });
                    return;
                }
                const selectMenu = new StringSelectMenuBuilder()
                    .setCustomId('useItem_tier_self_select')
                    .setPlaceholder('Wähle ein Tier aus')
                    .addOptions(tierarten.map(tierart => ({
                        label: tierart,
                        value: tierart
                    })));
                const row = new ActionRowBuilder().addComponents(selectMenu);
                await targetMessage.edit({
                    content: 'Wähle ein Tier aus, das du besitzen möchtest:',
                    components: [row],
                    flags: MessageFlags.Ephemeral
                });
            } else if (interaction.customId.includes('other')) {
                const selectMenu = new UserSelectMenuBuilder()
                    .setCustomId('useItem_tier_other_select')
                    .setPlaceholder('Wähle einen Nutzer aus, dem du ein Tier schenken möchtest.')
                    .setMinValues(1)
                    .setMaxValues(1);
                const row = new ActionRowBuilder().addComponents(selectMenu);
                await targetMessage.edit({
                    content: 'Wähle einen Nutzer aus, dem du ein Tier schenken möchtest:',
                    components: [row],
                    flags: MessageFlags.Ephemeral
                });
            }

        }
    } else if (interaction.isModalSubmit()) {
        return;
    } else if (interaction.isUserSelectMenu()) {
        return;
    }
};

async function getTierarten() {
    return await Tiere.aggregate([
        {
            $match: {
                $or: [
                    { besitzer: { $exists: false } },
                    { besitzer: null }
                ]
            }
        },
        {
            $group: {
                _id: "$tierart"
            }
        },
        {
            $project: {
                _id: 0,
                tierart: "$_id"
            }
        },
        {
            $group: {
                _id: null,
                tierarten: { $push: "$tierart" }
            }
        },
        {
            $project: {
                _id: 0,
                tierarten: 1
            }
        }
    ]);
}

async function getRandomTier(tierartName) {
    return await Tiere.aggregate([
        {
            $match: {
                tierart: tierartName,
                $or: [
                    { besitzer: { $exists: false } },
                    { besitzer: null }
                ]
            }
        },
        {
            $sample: { size: 1 }
        }
    ]);
}
