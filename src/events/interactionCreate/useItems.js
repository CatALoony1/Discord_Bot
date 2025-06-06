const { MessageFlags, StringSelectMenuBuilder, UserSelectMenuBuilder, ActionRowBuilder } = require('discord.js');
const GameUser = require('../../models/GameUser');
require('../../models/Bankkonten');
require('../../models/Inventar');
require('../../models/Items');
const Tiere = require('../../models/Tiere');
const Config = require('../../models/Config');

const hugTexts = [
    (author, target) => `${author} umarmt ${target} ganz fest! Awwww! ❤️`,
    (author, target) => `Eine warme Umarmung von ${author} für ${target}! 😊`,
    (author, target) => `${author} gibt ${target} eine liebevolle Umarmung. So süß! 🥰`,
    (author, target) => `Fühlt die Liebe! ${author} umarmt ${target}. ✨`,
    (author, target) => `Brauchst du eine Umarmung? ${author} ist für ${target} da! 🤗`,
    (author, target) => `${author} schließt ${target} in die Arme. Pure Zuneigung! 💖`,
    (author, target) => `*Umarmungsgeräusche* ${author} umarmt ${target}! 😄`,
    (author, target) => `Da ist eine Umarmung von ${author} an ${target} unterwegs! Genießt es! ✨`,
    (author, target) => `So ein schöner Moment: ${author} umarmt ${target}. 🥺`,
    (author, target) => `${author} hat ${target} umarmt! Herz erwärmend! 🌡️`,
    (author, target) => `Niemand ist zu cool für eine Umarmung! ${author} umarmt ${target}. 😎`,
    (author, target) => `Sende ${target} eine riesige Umarmung von ${author}! 🫂`,
    (author, target) => `Die ultimative Geste der Zuneigung: ${author} umarmt ${target}. 💫`,
    (author, target) => `Ein kleiner Moment der Freude, ${author} umarmt ${target}. 😊`,
    (author, target) => `${author} ist heute in Umarmungslaune und hat ${target} erwischt! 🥰`,
];

const kissTexts = [
    (author, target) => `${author} gibt ${target} einen sanften Kuss auf die Wange! 😙`,
    (author, target) => `Mwah! ${author} küsst ${target} liebevoll. 😘`,
    (author, target) => `Ein flüchtiger Kuss von ${author} für ${target}! ✨`,
    (author, target) => `${author} sendet ${target} einen dicken Schmatzer! 💋`,
    (author, target) => `Süße Küsse von ${author} an ${target}. 🥰`,
    (author, target) => `Uhm, okay... ${author} küsst ${target}. Mal sehen, was passiert! 😉`,
    (author, target) => `Ein Kuss, der Herzen verbindet: ${author} küsst ${target}! ❤️`,
    (author, target) => `${author} verteilt Zuneigung in Form eines Kusses an ${target}. 💖`,
    (author, target) => `Da ist ein kleiner Kuss von ${author} für ${target} unterwegs! 😚`,
    (author, target) => `Schmatz! ${author} küsst ${target} zur Begrüßung. 👋`,
    (author, target) => `${author} stiehlt einen Kuss von ${target}! Frechdachs! 😏`,
    (author, target) => `Manchmal sagt ein Kuss mehr als tausend Worte. ${author} küsst ${target}. 💫`,
    (author, target) => `Die Lippen treffen sich! ${author} küsst ${target}. 👀`,
    (author, target) => `Ein überraschender Kuss von ${author} für ${target}! Genieß es! 🤫`,
];

module.exports = async (interaction) => {
    if (!interaction.customId || !interaction.customId.includes('useItem')) return;
    try {
        if (interaction.customId.includes('tier')) {
            await useItemTier(interaction);
        } else if (interaction.customId.includes('farbrolle')) {
            await useItemFarbrolle(interaction);
        } else if (interaction.customId.includes('voicechannel')) {
            await useItemVoiceChannel(interaction);
        } else if (interaction.customId.includes('rolleNamensliste')) {
            await useItemRolleNamensliste(interaction);
        } else if (interaction.customId.includes('doppelteXp_activate')) {
            await useItemDoppelteXp(interaction);
        } else if (interaction.customId.includes('obersterPlatz_activate')) {
            await useItemObersterPlatz(interaction);
        } else if (interaction.customId.includes('bankkontoUpgrade_activate')) {
            await useItemBankkontoUpgrade(interaction);
        } else if (interaction.customId.includes('umarmung_select')) {
            await useItemUmarmung(interaction);
        } else if (interaction.customId.includes('kuss_select')) {
            await useItemKuss(interaction);
        } else if (interaction.customId.includes('bombe')) {
            await useItemBombe(interaction);
        } else if (interaction.customId.includes('loserlingKlauBanane_select')) {
            await useItemLoserlingKlauBanane(interaction);
        } else if (interaction.customId.includes('schuldschein_select')) {
            await useItemSchuldschein(interaction);
        }
    } catch (error) {
        console.log(error);
    }
};

async function useItemTier(interaction) {
    if (interaction.customId.includes('self_select')) {
        const tierart = interaction.values[0];
        const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
        const randomTierOhneBesitzer = await getRandomTier(tierart);
        if (randomTierOhneBesitzer.length === 0) {
            await interaction.update({
                content: 'Es gibt leider keine verfügbaren Tiere dieser Art!', components: [],
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const itemId = user.inventar.items.findIndex(item => item.item.name === 'Tier');
        if (user.inventar.items[itemId].quantity > 1) {
            user.inventar.items[itemId].quantity -= 1;
        } else if (user.inventar.items[itemId].quantity === 1) {
            user.inventar.items.splice(itemId, 1);
        } else {
            await interaction.update({
                content: 'Du hast kein Tier in deinem Inventar!', components: [],
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        await interaction.update({
            content: `Du hast erfolgreich ein Tier der Art **${tierart}** mit dem tollen namen **${randomTierOhneBesitzer[0].pfad}** erhalten!`,
            files: [`./animals/${randomTierOhneBesitzer[0].pfad}.webp`],
            components: [],
            flags: MessageFlags.Ephemeral
        });
        await Tiere.findByIdAndUpdate(
            randomTierOhneBesitzer[0]._id,
            { besitzer: user._id }
        );
        await user.inventar.save();
    } else if (interaction.customId.includes('other_select')) {
        const targetUser = interaction.values[0];
        const tierarten = await getTierarten();
        if (tierarten.length === 0 || tierarten[0].tierarten.length === 0) {
            await interaction.update({
                content: 'Es gibt leider keine verfügbaren Tiere!', components: [],
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId(`useItem_tier_other_uselect_${targetUser}`)
            .setPlaceholder('Wähle ein Tier aus')
            .addOptions(tierarten[0].tierarten.map(tierart => ({
                label: tierart,
                value: tierart
            })));
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({
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
            await interaction.update({
                content: 'Es gibt leider keine verfügbaren Tiere dieser Art!', components: [],
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const itemId = user.inventar.items.findIndex(item => item.item.name === 'Tier');
        if (user.inventar.items[itemId].quantity > 1) {
            user.inventar.items[itemId].quantity -= 1;
        } else {
            user.inventar.items.splice(itemId, 1);
        }
        await interaction.update({
            content: `Du hast erfolgreich ein Tier der Art **${tierart}** mit dem tollen namen **${randomTierOhneBesitzer[0].pfad}** an <@${targetUserId}> verschenkt!`,
            files: [`./animals/${randomTierOhneBesitzer[0].pfad}.webp`],
            components: [],
            flags: MessageFlags.Ephemeral
        });
        await interaction.channel.send({ content: `<@${targetUserId}> du hast ein Tier der Art **${tierart}** mit dem tollen namen **${randomTierOhneBesitzer[0].pfad}** von <@${interaction.user.id}> erhalten!`, files: [`./animals/${randomTierOhneBesitzer[0].pfad}.webp`] });
        await Tiere.findByIdAndUpdate(
            randomTierOhneBesitzer[0]._id,
            { besitzer: user._id }
        );
        await user.inventar.save();
    } else if (interaction.customId.includes('self')) {
        const tierarten = await getTierarten();
        if (tierarten.length === 0 || tierarten[0].tierarten.length === 0) {
            await interaction.update({
                content: 'Es gibt leider keine verfügbaren Tiere!', components: [],
                flags: MessageFlags.Ephemeral
            });
            return;
        }
        const selectMenu = new StringSelectMenuBuilder()
            .setCustomId('useItem_tier_self_select')
            .setPlaceholder('Wähle ein Tier aus')
            .addOptions(tierarten[0].tierarten.map(tierart => ({
                label: tierart,
                value: tierart
            })));
        const row = new ActionRowBuilder().addComponents(selectMenu);
        await interaction.update({
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
        await interaction.update({
            content: 'Wähle einen Nutzer aus, dem du ein Tier schenken möchtest:',
            components: [row],
            flags: MessageFlags.Ephemeral
        });
    }
}


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


async function useItemFarbrolle(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Farbrolle');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.editReply({
            content: 'Du hast keine Farbrolle in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const color = interaction.fields.getTextInputValue('useItem_farbrolle_color');
    const rolename = interaction.fields.getTextInputValue('useItem_farbrolle_name');
    let targetChannel = interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) || (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
    await targetChannel.send(`${interaction.member} hat die Farbrolle **${rolename}** mit der Farbe **${color}** gekauft! Bitte erstellen!`);
    await interaction.editReply({
        content: `Die Farbrolle **${rolename}** mit der Farbe **${color}** wurde erfolgreich an die Admins weitergeleitet!`,
        flags: MessageFlags.Ephemeral
    });
}

async function useItemVoiceChannel(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Voicechannel');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.editReply({
            content: 'Du hast keine Voicechannel in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const channelname = interaction.fields.getTextInputValue('useItem_voicechannel_name');
    let targetChannel = interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) || (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
    await targetChannel.send(`${interaction.member} hat den Voicechannel **${channelname}** gekauft! Bitte erstellen!`);
    await interaction.editReply({
        content: `Der Voicechannel **${channelname}** wurde erfolgreich an die Admins weitergeleitet!`,
        flags: MessageFlags.Ephemeral
    });
}

async function useItemRolleNamensliste(interaction) {
    await interaction.deferReply({ flags: MessageFlags.Ephemeral });
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Rolle (Namensliste)');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.editReply({
            content: 'Du hast keine Rolle (Namensliste) in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const channelname = interaction.fields.getTextInputValue('useItem_rolleNamensliste_name');
    let targetChannel = interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) || (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
    await targetChannel.send(`${interaction.member} hat die Rolle (Namensliste) **${channelname}** gekauft! Bitte erstellen!`);
    await interaction.editReply({
        content: `Die Rolle (Namensliste) **${channelname}** wurde erfolgreich an die Admins weitergeleitet!`,
        flags: MessageFlags.Ephemeral
    });
}

async function useItemDoppelteXp(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Doppelte XP');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.update({
            content: 'Du hast kein Doppelte XP in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const xpMultiplier = await Config.findOne({ key: 'xpMultiplier', guildId: interaction.guild.id });
    if (!xpMultiplier) {
        await Config.create({ name: 'key', value: 2, guildId: interaction.guild.id});
    } else {
        xpMultiplier.value = 2;
        await xpMultiplier.save();
    }
    await interaction.update({
        content: 'Du hast erfolgreich Doppelte XP aktiviert! Alle erhalten nun doppelte XP für 1 Stunde.',
        components: [],
        flags: MessageFlags.Ephemeral
    });
    const targetChannel = interaction.guild.channels.cache.get(process.env.WELCOME_ID) || (await interaction.guild.channels.fetch(process.env.WELCOME_ID));
    await targetChannel.send(`${interaction.user} hat Doppelte XP aktiviert! Alle erhalten nun doppelte XP für 1 Stunde.`);
    setTimeout(async () => {
        const xpMultiplier = await Config.findOne({ name: 'xpMultiplier' });
        if (xpMultiplier) {
            xpMultiplier.value = 1;
            await xpMultiplier.save();
            await targetChannel.send('Die Doppelte XP ist nun abgelaufen! Alle erhalten wieder normale XP.');
        }
    }, 3600000);
}

async function useItemObersterPlatz(interaction) {
    const role = interaction.guild.roles.cache.get('1380423808623841340') || (await interaction.guild.roles.fetch('1380423808623841340'));
    if (!role) {
        await interaction.update({
            content: 'Die Rolle "Oberster Platz" konnte nicht gefunden werden!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Oberster Platz');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.update({
            content: 'Du hast kein Oberster Platz in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    await interaction.member.roles.add(role);
    await interaction.update({
        content: `Du hast erfolgreich die Rolle **Oberster Platz** für 6h erhalten erhalten!`,
        components: [],
        flags: MessageFlags.Ephemeral
    });
    setTimeout(async () => {
        await interaction.member.roles.remove(role);
        await interaction.channel.send(`<@${interaction.user.id}> deine Rolle **Oberster Platz** ist nun abgelaufen!`);
    }, 21600000);
}


async function useItemBankkontoUpgrade(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } }).populate('bankkonto');
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Bankkonto Upgrade');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.update({
            content: 'Du hast kein Bankkonto Upgrade in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    user.bankkonto.zinsProzent += 1;
    await user.bankkonto.save();
    await interaction.update({
        content: `Du hast erfolgreich dein Bankkonto auf **${user.bankkonto.zinsProzent}%** Zinsen pro Tag geupgradet!`,
        components: [],
        flags: MessageFlags.Ephemeral
    });
}

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function useItemUmarmung(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } }).populate('bankkonto');
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Umarmung');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.update({
            content: 'Du hast kein Umarmung in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const targetUserId = interaction.values[0];
    let data = null;
    const fetch = await import('node-fetch').then(module => module.default);
    await fetch('https://nekos.life/api/v2/img/hug')
        .then((response) => response.json())
        .then((mydata) => {
            data = mydata;
        });
    const hugGifUrl = data.url;
    const hugText = hugTexts[getRandom(0, hugTexts.length - 1)](`<${interaction.user.id}`, `<@${targetUserId}>`);
    await interaction.channel.send({
        content: hugText,
        files: [hugGifUrl],
        allowedMentions: { users: [targetUserId] }
    });
    await interaction.update({
        content: `Du hast erfolgreich eine Umarmung an <@${targetUserId}> geschickt!`,
        components: [],
        flags: MessageFlags.Ephemeral
    });
}

async function useItemKuss(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } }).populate('bankkonto');
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Küsse');
    if (user.inventar.items[itemId].quantity > 1) {
        user.inventar.items[itemId].quantity -= 1;
    } else if (user.inventar.items[itemId].quantity === 1) {
        user.inventar.items.splice(itemId, 1);
    } else {
        await interaction.update({
            content: 'Du hast kein Küsse in deinem Inventar!', components: [],
            flags: MessageFlags.Ephemeral
        });
        return;
    }
    await user.inventar.save();
    const targetUserId = interaction.values[0];
    let data = null;
    const fetch = await import('node-fetch').then(module => module.default);
    await fetch('https://nekos.life/api/v2/img/kiss')
        .then((response) => response.json())
        .then((mydata) => {
            data = mydata;
        });
    const kissGifUrl = data.url;
    const kissText = kissTexts[getRandom(0, hugTexts.length - 1)](`<${interaction.user.id}`, `<@${targetUserId}>`);
    await interaction.channel.send({
        content: kissText,
        files: [kissGifUrl],
        allowedMentions: { users: [targetUserId] }
    });
    await interaction.update({
        content: `Du hast erfolgreich einen Kuss an <@${targetUserId}> geschickt!`,
        components: [],
        flags: MessageFlags.Ephemeral
    });
}

async function useItemBombe(interaction) {
    await interaction.update('Kommt bald!');
    return;
}

async function useItemLoserlingKlauBanane(interaction) {
    await interaction.update('Kommt bald!');
    return;
}

async function useItemSchuldschein(interaction) {
    await interaction.update('Kommt bald!');
    return;
}
