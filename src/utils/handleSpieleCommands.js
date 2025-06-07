const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags, EmbedBuilder } = require('discord.js');
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
        case 'Loserling-Klau-Banane': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_loserlingKlauBanane_select')
                .setPlaceholder('Wähle einen Nutzer aus, dessen Loserlinge du klauen möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, dessen Loserlinge du klauen möchtest.`;
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
        return `${tier.pfad}`;
    }).join('\n');
    const messageEdited = new EmbedBuilder();
    messageEdited.setColor(0x0033cc);
    messageEdited.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ size: 256 }) });
    messageEdited.setTitle(`Deine Stats:`);
    messageEdited.addFields({ name: 'Rang:', value: `${currentRank}` });
    messageEdited.addFields({ name: 'Aktuelle Loserlinge:', value: `${user.bankkonto.currentMoney}` });
    messageEdited.addFields({ name: 'Erhaltene Loserlinge:', value: `${user.bankkonto.moneyGain}` });
    messageEdited.addFields({ name: 'Verlorene/Ausgegebene Loserlinge:', value: `${user.bankkonto.moneyLost}` });
    messageEdited.addFields({ name: 'Anzahl Lottospiele:', value: `${lottospiele}` });
    messageEdited.addFields({ name: 'Quizspiele hinzugefügt:', value: `${user.quizadded}` });
    messageEdited.addFields({ name: 'Inventar', value: `${itemNamesAndQuantity}` });
    messageEdited.addFields({ name: 'Tiere', value: `${tierpfade}` });
    interaction.editReply({ embeds: [messageEdited] });
}

async function handleOwnAnimals(interaction) {
    const replyData = await createAnimalsEmbeds(0, interaction);
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

    const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);

    await interaction.editReply({
        embeds: [replyData.embed],
        files: [replyData.file],
        components: [firstRow]
    });
}


module.exports = {
    handleShop,
    handleUseItem,
    handleGamestats,
    handleOwnAnimals
};