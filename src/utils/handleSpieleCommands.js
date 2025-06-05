const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags } = require('discord.js');
const createShopEmbeds = require('../utils/createShopEmbeds.js');
const GameUser = require('../models/GameUser.js');
require('../models/Inventar.js');
require('../models/Items.js');

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
    const item = user.inventar.items[itemId].item;
    if (!item || user.inventar.items[itemId].quantity <= 0) {
        await interaction.reply({ content: 'Dieses Item existiert nicht in deinem Inventar!', flags: MessageFlags.Ephemeral });
        return;
    }
    const itemName = item.name;
    let firstRow;
    let content = 'Fehler';
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
                .setCustomId('useItem_bombe_select')
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
                .setMaxLength(100);
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
    }
    if (content === 'Fehler') {
        await interaction.showModal(modal);
    } else {
        await interaction.editReply({
            content: content,
            components: [firstRow]
        });
    }
}


module.exports = {
    handleShop,
    handleUseItem,
};