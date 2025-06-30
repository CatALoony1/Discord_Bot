const { ActionRowBuilder, ButtonBuilder, ButtonStyle, UserSelectMenuBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, MessageFlags, EmbedBuilder, StringSelectMenuBuilder } = require('discord.js');
const createShopEmbeds = require('../utils/createShopEmbeds.js');
const GameUser = require('../models/GameUser.js');
require('../models/Inventar.js');
require('../models/Items.js');
require('../models/Bankkonten.js');
require('../models/Tiere.js');
const Lottozahlen = require('../models/Lottozahlen.js');
const createAnimalsEmbeds = require('../utils/createAnimalsEmbeds.js');

const keksTexts = [
    " frisst nen Keks!",
    " fühlt sich nach dem Keksessen ein kleines bisschen runder. Eine gute Runde extra Bauchkraulen!",
    " hat den Keks genüsslich verschlungen. Der Gürtel sitzt jetzt irgendwie... gemütlicher.",
    " spürt, wie sich der Keks direkt auf die Hüften legt. Mehr zum Liebhaben!",
    " hat sich einen Keks gegönnt und der Waage einen kleinen Schock verpasst. Aber hey, Glück ist keine Frage der Größe!",
    " hat Keks-Energie getankt! Bereit für ein Nickerchen. Oder noch einen Keks?",
    " genießt das Gefühl der vollen Magen. Ein Keks war genau das, was gebraucht wurde!",
    " hat sich soeben in eine glückliche Keks-Komawurst verwandelt. Weiter so!",
    " hat das Geräusch des Keks-Knusperns noch im Ohr. Und das Gewicht auf den Rippen.",
    " ist jetzt offiziell Keks-beauftragt für Gemütlichkeit. Glückwunsch zur Gewichtszunahme!",
    " hat den Keks mit einem zufriedenen Seufzer verputzt. Die Welt ist jetzt ein besserer, süßerer Ort.",
    " hat den Keks regelrecht inhaliert! Die Waage lacht. Und dann weint sie leise.",
    " hat bewiesen, dass Kekse nicht nur gut schmecken, sondern auch beim Winterfell helfen. Gewichtszunahme erfolgreich!",
    " hat nun offiziel den Status 'Kuschelweich dank Keks' erreicht.",
    " ist jetzt nicht nur im Herzen, sondern auch im Bauch ein Keks-Liebhaber. Und das sieht man!",
    " hat den Keks nicht gegessen, sondern adoptiert und in den Magen einziehen lassen. Die Waage freut sich mit!",
    " spürt die Macht des Kekses! Eine neue, gemütliche Ära beginnt.",
    " hat den Keks heldenhaft bekämpft... und verloren. Aber ein leckerer Verlust!",
    " ist jetzt quasi eine keksgefüllte Piñata. Vorsicht beim Umarmen!",
    " hat den Keks so schnell gegessen, dass das Universum noch nicht mit dem Zunehmen nachgekommen ist. Aber es kommt!",
    " hat einen Keks verschlungen und fühlt sich nun bereit für ein Leben in Gemütlichkeit und süßen Träumen.",
    " hat den Keks so erfolgreich verdrückt, dass alle nun sehr stolz sind! Gewichtszunahme: check!",
    " beweist einmal mehr, dass wir in 'LEAFing Realtiy' auch im Zunehmen Spitzenklasse sind.",
    " hat den Keks nicht nur gegessen, sondern regelrecht ins Herz geschlossen. Oder besser gesagt: in die Hüften.",
    " ist nun offiziell das Vorzeigemodell von 'LEAFing Reality' in Sachen Keksverwertung und Gewichtszunahme.",
    " hat den Keksheldenstatus in 'LEAFing Reality' erreicht - der Bauch wächst, die Legende auch!",
    " hat den Keks verputzt und sich damit nahtlos in die Liga der gemütlichen 'LEAFing Reality'-Mitglieder eingereiht.",
    " zeigt, dass hier auch das Zunehmen perfektioniert werden kann. Ein Keks nach dem anderen!",
    " hat den Keks nicht nur genossen, sondern auch das offizielle 'LEAFing Reality'-Siegel auf die Waage gedrückt bekommen.",
    " ist jetzt nicht nur Mitglied, sondern auch das Schwergewicht des Servers. Glückwunsch zur Keks-Masse!",
    " hat den Keks im Namen des Servers geopfert - für mehr Gemütlichkeit und eine extra Portion Gewicht.",
    " hat den Keks mit voller Inbrunst verschlungen. Das Ergebnis ist sichtbar!",
    " hat den Keks mit Bravour gemeistert und dabei die goldene Regel des Servers befolgt: Essen, bis es wehtut (vom Zunehmen).",
    " hat den Keks 🍪 wie ein Profi vernichtet! Die Waage lacht sich ins Fäustchen... und wir auch! 😂",
    " beweist, dass bei uns auch das Zunehmen eine Kunst ist. 🎨 Mehr Speck, mehr Spaß! 🐷",
    " hat den Keks nicht gegessen, sondern geatmet. 🌬️💨",
    " spürt, wie der Keks 🍪 direkt in die Wohlfühlzone wandert. Hallo, neue Polster! 👋🛋️",
    " ist jetzt offiziell im 'Keks-Koma' 😵‍💫 angekommen. Wir sind stolz auf diese Leistung! 🏆",
    " hat den Keks verputzt und fühlt sich jetzt so rund wie eine Bowlingkugel! 🎳",
    " hat sich soeben ein neues Lebensziel gesetzt: Noch mehr Kekse! 🎯 Und das Gewicht? Ein schöner Bonus! ✨",
    " hat den Keks mit Liebe ❤️ und Leidenschaft verdrückt. Der Bauch dankt es mit extra Gemütlichkeit! 🤗",
    " hat den Keks nicht verschlungen, sondern *liebevoll aufgenommen*. 🥺 Und das Gewicht? Eine schöne Erinnerung! 💖",
    " hat den Keks als Sprungbrett für eine Karriere als Kuschelkissen genutzt. 🚀 cushions Mehr Kilos, mehr Komfort! 😴",
    " zeigt uns, wie man richtig isst. 🍽️ Und zunimmt. 💯 Du bist ein Vorbild! 👍",
    " ist jetzt so voll mit Keks, dass selbst die Schwerkraft stärker wird. 🌎🚀 Willkommen im Club der Schwergewichte! 🏋️",
    " hat den Keks erfolgreich in Energie umgewandelt... und in ein paar extra Pfunde. 🔋➡️⚖️",
    " hat erfolgreich 60g Keksmasse in 60g Körpermasse umgewandelt! 💪",
    " ist jetzt exakt 60g schwerer und glücklicher. 🥳",
    " hat den Keks von 60g heldenhaft bezwungen und trägt nun stolz die 60g extra Gewicht. Ein wahres Vorbild! 🏆",
    " hat bewiesen, dass 60g Keks direkt auf die Hüften gehen können. Willkommen im Club der 60g-Gewinner! 😂",
    " hat 60g Keks verdrückt und fühlt sich nun um 60g gemütlicher.🛋️",
    " hat die 60g Keks so schnell verschlungen, dass das Universum noch versucht, die 60g Gewichtszunahme zu verarbeiten. 🌠",
    " hat die 60g Keks als Grundstein für ein neues, gemütlicheres Ich gelegt. Bravo! 🧱",
    " trägt jetzt stolze 60g mehr auf den Rippen - alles dank des köstlichen Kekses.🎉",
    " hat die 60g Keks nicht einfach gegessen, sondern strategisch platziert. Die Waage ist beeindruckt! 📊",
    " hat die 60g Keks in pure Liebe verwandelt - und in 60g extra zum Liebhaben. ❤️",
    " fühlt sich nach dem Keksessen ein kleines bisschen runder. Eine gute Runde extra Bauchkraulen!",
    " spürt, wie der Keks direkt auf die Hüften wandert. Herzlichen Glückwunsch zum neuen 'Keks-Glow'!",
    " hat den Keks genossen und fühlt sich nun bereit für ein Nickerchen. Das Gewicht? Nur ein süßer Nebeneffekt!",
    " wundert sich, ob Kekse eigentlich auch fliegen können - denn leichter ist dadurch niemand geworden. Eher im Gegenteil!",
    " hat den Keks wohl nicht nur gegessen, sondern auch geatmet. Das zusätzliche Gewicht ist der Beweis!",
    " ist nun offiziell im 'Team Gemütlich' angekommen. Der Keks hat ganze Arbeit geleistet!",
    " staunt nicht schlecht, wie schnell dieser Keks auf die Waage hüpft. Aber lecker war's!",
    " hat sich mit diesem Keks einen kleinen Wohlfühlbauch angefuttert. Perfekt zum Knuddeln!",
    " muss sich vielleicht bald neue Hosen kaufen - der Keks war einfach zu mächtig!",
    " fühlt sich nach dem Keksessen ein bisschen wie ein rollender Hügel. Aber ein glücklicher Hügel!",
    " hat bewiesen, dass Liebe durch den Magen geht - und sich dort auch gerne festsetzt. Keks sei Dank!",
    " hat soeben seine persönliche Schwerkraft erhöht. Das Geheimnis? Kekse!",
    " grinst breit, denn der Keks war es wert. Ein bisschen mehr Gewicht? Pff, Details!",
    " ist nun offiziell ein 'Keks-Champion' im Gewichtszulegen. Bravo!",
    " merkt, wie sich jeder Keks aufs Neue in ein kleines Bäuchlein verwandelt. Komfort pur!",
    " hat nun mehr 'Substanz'. Der Keks hat's möglich gemacht!",
    " ist auf dem besten Weg, ein wahrer 'Keks-Mensch' zu werden. Das Gewicht steigt stetig!",
    " spürt ein leichtes Vibrieren der Waage nach dem Keks. Alles im grünen Bereich - oder roten, je nach Zunahme!",
    " hat seinen Körper mit einem Keks verwöhnt und das dankt er ihm mit ein paar zusätzlichen Gramm. Genieß es!",
    " freut sich über jeden Keks, der ihn 'voluminöser' macht. Mehr zum Kuscheln!",
    " fühlt sich nach dem Keksessen ein kleines bisschen runder. Offenbar hilft der Keks dabei, sich tiefer in die LEAFing Reality zu erden!",
    " spürt, wie der Keks direkt auf die Hüften wandert. Ein echter Realitätscheck für das eigene Gewicht in LEAFing Reality!",
    " hat den Keks genossen und fühlt sich nun bereit für ein Nickerchen. Das zusätzliche Gewicht lässt dich noch tiefer in die LEAFing Reality eintauchen!",
    " wundert sich, ob Kekse in LEAFing Reality eigentlich auch schweben können - denn leichter ist dadurch niemand geworden. Eher im Gegenteil!",
    " hat den Keks wohl nicht nur gegessen, sondern auch geatmet. Willkommen im Club der 'Realitäts-Schwergewichte' von LEAFing Reality!",
    " ist nun offiziell im 'Team Gemütlich' von LEAFing Reality angekommen. Der Keks hat ganze Arbeit geleistet!",
    " staunt nicht schlecht, wie schnell dieser Keks auf die Waage in LEAFing Reality hüpft. Aber lecker war's!",
    " hat sich mit diesem Keks einen kleinen Wohlfühlbauch angefuttert. Perfekt, um sich in LEAFing Reality einzukuscheln!",
    " muss sich vielleicht bald neue Hosen kaufen - der Keks war einfach zu mächtig für die LEAFing Reality-Garderobe!",
    " fühlt sich nach dem Keksessen ein bisschen wie ein rollender Hügel. Aber ein glücklicher Hügel in LEAFing Reality!",
    " hat bewiesen, dass Liebe durch den Magen geht - und sich dort auch gerne festsetzt. Besonders in der LEAFing Reality!",
    " hat soeben seine persönliche Schwerkraft erhöht. Das Geheimnis in LEAFing Reality? Kekse!",
    " grinst breit, denn der Keks war es wert. Ein bisschen mehr Gewicht in LEAFing Reality? Pff, Details!",
    " ist nun offiziell ein 'Keks-Champion' im Gewichtszulegen in LEAFing Reality. Bravo!",
    " merkt, wie sich jeder Keks aufs Neue in ein kleines Bäuchlein verwandelt. Komfort pur in LEAFing Reality!",
    " hat nun mehr 'Substanz', um sich in LEAFing Reality zu behaupten. Der Keks hat's möglich gemacht!",
    " ist auf dem besten Weg, ein wahrer 'Keks-Mensch' von LEAFing Reality zu werden. Das Gewicht steigt stetig!",
    " spürt ein leichtes Vibrieren der Waage nach dem Keks. Alles im grünen Bereich - oder roten, je nach Zunahme in LEAFing Reality!",
    " hat seinen Körper mit einem Keks verwöhnt und das dankt er ihm mit ein paar zusätzlichen Gramm. Genieß es in LEAFing Reality!",
    " freut sich über jeden Keks, der ihn 'voluminöser' macht. Mehr zum Kuscheln in LEAFing Reality!"
];

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
        case 'Magische-Kraft-Klau-Banane': {
            const selectMenu = new UserSelectMenuBuilder()
                .setCustomId('useItem_MagischeKraftKlauBanane_select')
                .setPlaceholder('Wähle einen Nutzer aus, dessen Magische Kraft du klauen möchtest.')
                .setMinValues(1)
                .setMaxValues(1);
            firstRow = new ActionRowBuilder().addComponents(selectMenu);
            content = `Wähle einen Nutzer aus, dessen Magische Kraft du klauen möchtest.`;
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
    messageEdited.addFields({ name: 'Aktuelle Magische Kraft:', value: `${user.bankkonto.currentMoney}` });
    messageEdited.addFields({ name: 'Erhaltene Magische Kraft:', value: `${user.bankkonto.moneyGain}` });
    messageEdited.addFields({ name: 'Verlorene/Ausgegebene Magische Kraft:', value: `${user.bankkonto.moneyLost}` });
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

function getRandom(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function handleKeksEssen(interaction) {
    const user = await GameUser.findOne({ userId: interaction.user.id }).populate({ path: 'inventar', populate: { path: 'items.item', model: 'Items' } });
    const itemId = user.inventar.items.findIndex(item => item.item.name === 'Keks');
    const quantity = user.inventar.items[itemId].quantity;
    const options = [
        { label: '1', value: '1' },
        { label: 'alle', value: `${quantity}` }
    ];
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