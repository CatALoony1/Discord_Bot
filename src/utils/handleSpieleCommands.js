const { ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageFlags, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const createShopEmbeds = require('./createShopEmbeds.js');
const createAnimalsEmbeds = require('./createAnimalsEmbeds.js');
const createSpieleLeaderboardEmbeds = require('./createSpieleLeaderboardEmbeds.js');
const { getDaos } = require('./daos.js');


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
    const { inventarDAO } = getDaos();
    const targetUserObj = interaction.member;
    const inventar = await inventarDAO.getOneByUserAndGuild(targetUserObj.id, interaction.guild.id);
    if (!inventar || !inventar.besitzerObj) {
        await interaction.reply({ content: 'Du hast kein Inventar!', flags: MessageFlags.Ephemeral });
        return;
    }
    let items = inventar.items;
    if (!items || items.length == 0) {
        await interaction.reply({ content: 'Du besitzt keine items', flags: MessageFlags.Ephemeral });
        return;
    }
    const itemSelectMenu = new StringSelectMenuBuilder()
        .setCustomId(`useItem_selectMenu`)
        .setPlaceholder('Wähle ein Item aus, das du benutzen möchtest.')
        .setMinValues(1)
        .setMaxValues(1)
        .addOptions(
            items.map((item) => {
                const itemName = item.itemObj.name;
                return {
                    label: itemName,
                    value: itemName
                };
            })
        );
    const row = new ActionRowBuilder().addComponents(itemSelectMenu);
    await interaction.reply({
        content: 'Wähle ein Item aus, das du benutzen möchtest:',
        components: [row],
        flags: MessageFlags.Ephemeral
    });
}

async function handleGamestats(interaction) {
    const { tiereDAO, inventarDAO, bankkontenDAO, lottozahlenDAO } = getDaos();
    await interaction.deferReply();
    const targetUserId = interaction.member.id;
    const bankkonto = await bankkontenDAO.getOneByUserAndGuild(targetUserId, interaction.guild.id);
    if (!bankkonto) {
        interaction.editReply("Du hast noch kein Level");
        return;
    }
    const user = bankkonto.besitzerObj;
    const inventar = await inventarDAO.getOneByBesitzer(user._id);
    const tiere = await tiereDAO.getAllByBesitzer(user._id);

    let allBankkonten = await bankkontenDAO.getAllByGuild(interaction.guild.id);

    var oldUsers = [];
    for (let j = 0; j < allBankkonten.length; j++) {
        if (!(interaction.guild.members.cache.find(m => m.id === allBankkonten[j].besitzerObj.userId)?.id)) {
            oldUsers[oldUsers.length] = j;
        }
    }
    for (let j = 0; j < oldUsers.length; j++) {
        allBankkonten.splice(oldUsers[j] - j, 1);
    }

    allBankkonten.sort((a, b) => {
        return b.currentMoney - a.currentMoney;
    });
    let currentRank = allBankkonten.findIndex((usr) => usr.userObj.userId === targetUserId) + 1;
    let lotto = await lottozahlenDAO.getAllByUserAndGuild(targetUserId, interaction.guild.id);
    var lottospiele = 0;
    if (lotto && lotto.length > 0) {
        lottospiele = lotto.length;
    }
    const itemNamesAndQuantity = inventar.items.map((item, index) => {
        return `ID:${index} -> ${item.itemObj.name} (x${item.quantity})`;
    }).join('\n');
    const tierpfade = tiere.map((tier) => {
        return `${tier.customName}`;
    }).join('\n');
    const messageEdited = new EmbedBuilder();
    messageEdited.setColor(0x0033cc);
    messageEdited.setAuthor({ name: interaction.member.user.username, iconURL: interaction.member.user.displayAvatarURL({ size: 256 }) });
    messageEdited.setTitle(`Deine Stats:`);
    messageEdited.addFields({ name: 'Rang:', value: `${currentRank}` });
    messageEdited.addFields({ name: 'Aktuelle Blattläuse:', value: `${bankkonto.currentMoney}` });
    messageEdited.addFields({ name: 'Erhaltene Blattläuse:', value: `${bankkonto.moneyGain}` });
    messageEdited.addFields({ name: 'Verlorene/Ausgegebene Blattläuse:', value: `${bankkonto.moneyLost}` });
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
    const { inventarDAO } = getDaos();
    const inventar = await inventarDAO.getOneByUserAndGuild(interaction.user.id, interaction.guild.id);
    const itemId = inventar.items.findIndex(item => item.itemObj.name === 'Keks');
    const quantity = inventar.items[itemId].quantity;
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

async function handleLeaderboard(interaction) {
    const embed = await createSpieleLeaderboardEmbeds(0, interaction);
    const pageDownButton = new ButtonBuilder()
        .setEmoji('⬅️')
        .setLabel('Zurück')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`spieleLeaderDown`);

    const pageUpButton = new ButtonBuilder()
        .setEmoji('➡️')
        .setLabel('Vorwärts')
        .setStyle(ButtonStyle.Primary)
        .setCustomId(`spieleLeaderUp`);

    const firstRow = new ActionRowBuilder().addComponents(pageDownButton, pageUpButton);

    interaction.editReply({
        embeds: [embed],
        components: [firstRow]
    });
}


module.exports = {
    handleShop,
    handleUseItem,
    handleGamestats,
    handleOwnAnimals,
    handleKeksEssen,
    handleLeaderboard
};