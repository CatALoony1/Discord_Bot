const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const createShopEmbeds = require('../utils/createShopEmbeds.js');
const GameUser = require('../models/GameUser.js');
require('../models/Inventar.js');
require('../models/Items.js');
require('../models/Bankkonten.js');
require('../models/Tiere.js');
const Lottozahlen = require('../models/Lottozahlen.js');
const createAnimalsEmbeds = require('../utils/createAnimalsEmbeds.js');


async function handleShop(interaction) {
    const embed = await createShopEmbeds(0, interaction);
    const pageDownButton = new ButtonBuilder()
        .setEmoji('⬅️')
        .setLabel('Zurück')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`shopDown`);

    const pageUpButton = new ButtonBuilder()
        .setEmoji('➡️')
        .setLabel('Vorwärts')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`shopUp`);

    const buyButton = new ButtonBuilder()
        .setEmoji('🛒')
        .setLabel('Kaufen')
        .setStyle(ButtonStyle.Success)
        .setCustomId(`shopBuy`);

    const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);
    const secondRow = new ActionRowBuilder().addComponents(buyButton);

    await interaction.editReply({
        embeds: [embed],
        components: [firstRow, secondRow]
    });
}

async function handleUseItem(interaction) {
    const itemId = interaction.options.getInteger('item_id');
    const targetUserObj = interaction.member;
    const user = await GameUser.findOne({ userId: targetUserObj.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    if (!user || !user.inventar) {
        await interaction.reply({ content: 'Du hast kein Inventar!', flags: MessageFlags.Ephemeral });
        return;
    }
    let item = user.inventar.items[itemId];
    if (!item || item.quantity <= 0) {
        await interaction.reply({ content: 'Dieses Item existiert nicht in deinem Inventar!', flags: MessageFlags.Ephemeral });
        return;
    }
    item = item.item;
    const itemName = item.name;
    let firstRow;
    let content = 'Modal';
    let modal;
    switch (itemName) {
        case 'Tier': {
            const youButton = new ButtonBuilder()
                .setLabel('Selbst')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`useItem_tier_self`);
            const otherButton = new ButtonBuilder()
                .setLabel('Verschenken')
                .setStyle(ButtonStyle.Primary)
                .setCustomId(`useItem_tier_other`);
            firstRow = new ActionRowBuilder().addComponents(youButton, otherButton);
            content = `Möchtest du das Tier für dich selbst oder es jemandem schenken?`;
            break;
        }
        case 'Bombe': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_bombe_uselect')
                .setPlaceholder('Wähle einen Nutzer aus, der die Bombe erhalten soll.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, der die Bombe erhalten soll.`;
            break;
        }
        case 'Farbrolle': {
            modal = new ModalBuilder()
                .setTitle('Farbrolle erstellen')
                .setCustomId(`useItem_farbrolle`);
            const colorInput = new TextInputBuilder()
                .setCustomId('useItem_farbrolle_color')
                .setLabel('Farbe (Hex-Code):')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(7);
            const rollenName = new TextInputBuilder()
                .setCustomId('useItem_farbrolle_name')
                .setLabel('Name der Rolle:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(15);
            const firstActionRow = new ActionRowBuilder().addComponents(colorInput);
            const secondActionRow = new ActionRowBuilder().addComponents(rollenName);
            modal.addComponents(firstActionRow, secondActionRow);
            break;
        }
        case 'Voicechannel': {
            modal = new ModalBuilder()
                .setTitle('Voicechannel erstellen')
                .setCustomId(`useItem_voicechannel`);
            const channelNameInput = new TextInputBuilder()
                .setCustomId('useItem_voicechannel_name')
                .setLabel('Name des Voicechannels:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(100);
            const firstActionRow = new ActionRowBuilder().addComponents(channelNameInput);
            modal.addComponents(firstActionRow);
            break;
        }
        case 'Rolle (Namensliste)': {
            modal = new ModalBuilder()
                .setTitle('Rolle erstellen')
                .setCustomId(`useItem_rolleNamensliste`);
            const rollenNameInput = new TextInputBuilder()
                .setCustomId('useItem_rolleNamensliste_name')
                .setLabel('Name der Rolle:')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(100);
            const firstActionRow = new ActionRowBuilder().addComponents(rollenNameInput);
            modal.addComponents(firstActionRow);
            break;
        }
        case 'Umarmung': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_umarmung_select')
                .setPlaceholder('Wähle einen Nutzer aus, den du umarmen möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, den du umarmen möchtest.`;
            break;
        }
        case 'Küsse': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_kuss_select')
                .setPlaceholder('Wähle einen Nutzer aus, den du küssen möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, den du küssen möchtest.`;
            break;
        }
        case 'Doppelte XP': {
            const activateButton = new ButtonBuilder()
                .setLabel('Aktivieren')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`useItem_doppelteXp_activate`);
            firstRow = new ActionRowBuilder().addComponents(activateButton);
            content = `Möchtest du die doppelten XP aktivieren?`;
            break;
        }
        case 'Oberster Platz': {
            const activateButton = new ButtonBuilder()
                .setLabel('Aktivieren')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`useItem_obersterPlatz_activate`);
            firstRow = new ActionRowBuilder().addComponents(activateButton);
            content = `Möchtest du den obersten Platz aktivieren?`;
            break;
        }
        case 'Blattläuse-Klau-Banane': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_BlattläuseKlauBanane_select')
                .setPlaceholder('Wähle einen Nutzer aus, dessen Blattläuse du klauen möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, dessen Blattläuse du klauen möchtest.`;
            break;
        }
        case 'Schuldschein': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_schuldschein_select')
                .setPlaceholder('Wähle einen Nutzer aus, dem du den Schuldschein geben möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, dem du den Schuldschein geben möchtest.`;
            break;
        }
        case 'Bankkonto Upgrade': {
            const activateButton = new ButtonBuilder()
                .setLabel('Aktivieren')
                .setStyle(ButtonStyle.Success)
                .setCustomId(`useItem_bankkontoUpgrade_activate`);
            firstRow = new ActionRowBuilder().addComponents(activateButton);
            content = `Möchtest du das Bankkonto-Upgrade aktivieren?`;
            break;
        }
        case 'Keks': {
            const selectMenu = new StringSelectMenuBuilder()
                .setCustomId(`useItem_keks_select}`)
                .setPlaceholder('Was möchtest du tun?')
                .addOptions([
                    { label: 'Essen', value: 'essen' },
                    { label: 'Verschenken', value: 'schenken' }
                ]);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Möchtest du den Keks essen oder verschenken?`;
            break;
        }
        default:
            await interaction.reply({ content: `Das Item ${itemName} kann nicht benutzt werden.`, flags: MessageFlags.Ephemeral });
            return;
    }
    if (content === 'Modal') {
        await interaction.showModal(modal);
    } else {
        await interaction.reply({
            content: content,
            components: [firstRow],
            flags: MessageFlags.Ephemeral
        });
    }
}

async function handleGamestats(interaction) {
    await interaction.deferReply();
    const targetUserId = interaction.member.id;
    const user = await GameUser.findOne({
        userId: targetUserId,
        guildId: interaction.guild.id,
    }).populate('bankkonto').populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } }).populate('tiere');

    if (!user) {
        interaction.editReply("Du hast noch kein Level");
        return;
    }

    let allUsers = await GameUser.find({ guildId: interaction.guild.id }).populate('bankkonto');

    var oldUsers = [];
    for (let j = 0; j < allUsers.length; j++) {
        if (!(interaction.guild.members.cache.find(m => m.id === allUsers[j].userId)?.id)) {
            oldUsers[oldUsers.length] = j;
        }
    }
    for (let j = 0; j < oldUsers.length; j++) {
        allUsers.splice(oldUsers[j] - j, 1);
    }

    allUsers.sort((a, b) => {
        return b.bankkonto.currentMoney - a.bankkonto.currentMoney;
    });
    let currentRank = allUsers.findIndex((usr) => usr.userId === targetUserId) + 1;
    let lotto = await Lottozahlen.find({
        guildId: interaction.guild.id,
        userId: targetUserId,
    });
    var lottospiele = 0;
    if (lotto && lotto.length > 0) {
        lottospiele = lotto.length;
    }
    const itemNamesAndQuantity = user.inventar.items.map((item, index) => {
        return `ID:${index} -> ${item.item.name} (x${item.quantity})`;
    }).join('\n');
    const tierpfade = user.tiere.map((tier) => {
        return `${tier.customName}`;
    }).join('\n');
    const messageEdited = new EmbedBuilder();
    messageEdited.setColor(0x0033cc);
    messageEdited.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ size: 256 }) });
    messageEdited.setTitle(`Deine Stats:`);
    messageEdited.addFields({ name: 'Rang:', value: `${currentRank}` });
    messageEdited.addFields({ name: 'Aktuelle Blattläuse:', value: `${user.bankkonto.currentMoney}` });
    messageEdited.addFields({ name: 'Erhaltene Blattläuse:', value: `${user.bankkonto.moneyGain}` });
    messageEdited.addFields({ name: 'Verlorene/Ausgegebene Blattläuse:', value: `${user.bankkonto.moneyLost}` });
    messageEdited.addFields({ name: 'Anzahl Lottospiele:', value: `${lottospiele}` });
    messageEdited.addFields({ name: 'Quizfragen hinzugefügt:', value: `${user.quizadded}` });
    messageEdited.addFields({ name: 'Gewicht:', value: `${user.weight / 1000}kg` });
    messageEdited.addFields({ name: 'Inventar:', value: `${itemNamesAndQuantity}` });
    messageEdited.addFields({ name: 'Tiere:', value: `${tierpfade}` });
    interaction.editReply({ embeds: [messageEdited] });
}

async function handleOwnAnimals(interaction) {
    const replyData = await createAnimalsEmbeds(0, interaction.guild.id, interaction.user.id);
    if (!replyData) {
        interaction.editReply(`Du besitzt keine Tiere.`);
        return;
    }
    const pageDownButton = new ButtonBuilder()
        .setEmoji('⬅️')
        .setLabel('Zurück')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`ownAnimalsDown`);

    const pageUpButton = new ButtonBuilder()
        .setEmoji('➡️')
        .setLabel('Vorwärts')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`ownAnimalsUp`);

    const renameButton = new ButtonBuilder()
        .setEmoji('✏️')
        .setLabel('Umbenennen')
        .setStyle(ButtonStyle.Secondary)
        .setCustomId(`ownAnimalsRename`);

    const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton, renameButton);

    await interaction.editReply({
        embeds: [replyData.embed],
        files: [replyData.file],
        components: [firstRow]
    });
}

async function handleKeksEssen(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Keks');
    const quantity = user.inventar.items[itemId].quantity;
    const options = [
        { label: '1', value: '1' },
    ];
if (quantity > 1) {
        options.push({ label: 'alle', value: `${quantity}` });
    if (quantity > 10) {
        options.push({ label: '10', value: '10' });
        if (quantity > 100) {
            options.push({ label: '100', value: '100' });
            if (quantity > 1000) {
                options.push({ label: '1000', value: '1000' });
                if (quantity > 10000) {
                    options.push({ label: '10000', value: '10000' });
                }
            }
        }
    }
}
    const selectMenu = new StringSelectMenuBuilder()
        .setCustomId(`useItem_keks_essen`)
        .setPlaceholder('Wie viele Kekse möchtest du essen?')
        .addOptions(options)
        .setMinValues(1)
        .setMaxValues(1);
    const row = new ActionRowBuilder().addComponents(selectMenu);
    await interaction.editReply({
        content: 'Wähle aus, wie viele Kekse du essen möchtest:',
        components: [row],
        flags: MessageFlags.Ephemeral
    });
}


module.exports = {
    handleShop,
    handleUseItem,
    handleGamestats,
    handleOwnAnimals,
    handleKeksEssen
};