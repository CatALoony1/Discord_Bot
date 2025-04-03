const { StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');

const ageRoles = ['<18',
    '18-21',
    '22-25',
    '26-29',
    'Ü 30'];

const colorRoles = ['Hering Silber',
    'Thunfisch Grau',
    'Ozean-Türkis',
    'Kapitän Blau',
    'Lagunenblau',
    'Sturmbraus-Blau',
    'Marineblau',
    'Lachsrosa',
    'Krabbenrot',
    'Leuchtturm-Rot',
    'Fischernetz-Rostrot',
    'Voll Korall',
    'Zitronengelb',
    'Goldbarsch Gelb',
    'Panadegold',
    'Dillgrün',
    'Seegras-Grün',
    'Algen-Grün',
    'Tiefsee-Algen-Grün'];

const dmRoles = ['DMs open',
    'DMs closed'];

const dmEmojis = ['🔓', '🔒'];

const gameRoles = ['League of Legends',
    'Minecraft',
    'Dead by Daylight',
    'Fortnite',
    'Overwatch',
    'Call of Duty',
    'Garry\'s Mod',
    'Rocket League'];

const pingRoles = ['Begrüßungskomitee',
    'Bump-Ping',
    'Event-Ping'];

const pingEmojis = ['👋', '👊', '📅'];

const platformRoles = ['XBOX',
    'Switch',
    'PC',
    'Playstation',
    'Mobile'];

const pronounRoles = ['He/him',
    'She/her',
    'They/them'];

const regionRoles = ['Niedersachsen',
    'Bayern',
    'Berlin',
    'Hessem',
    'Thüringen',
    'Bremen',
    'Baden-Württemberg',
    'Saarland',
    'Sachsen',
    'Sachsen-Anhalt',
    'Mecklenburg-Vorpommern',
    'Brandenburg',
    'Schleswig-Holstein',
    'Nordrhein-Westfalen',
    'Hamburg',
    'Rheinland-Pfalz'];

module.exports = {
    data: new SlashCommandBuilder()
        .setName('printroleselect')
        .setDescription('Erzeugt ein Rollenselect.')
        .addStringOption(option =>
            option.setName('selectmenu')
                .setDescription('Das SelectMenu welches gesendet werden soll')
                .setRequired(true)
                .addChoices(
                    { name: 'age', value: 'age' },
                    { name: 'color', value: 'color' },
                    { name: 'dm', value: 'dm' },
                    { name: 'game', value: 'game' },
                    { name: 'ping', value: 'ping' },
                    { name: 'platform', value: 'platform' },
                    { name: 'pronoun', value: 'pronoun' },
                    { name: 'region', value: 'region' },
                )
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    /**
     * 
     * @param {Object} param0 
     * @param {import('discord.js').ChatInputCommandInteraction} param0.interaction
     */
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            const selectmenu = interaction.options.get('selectmenu').value;
            let rolenames = [];
            let smCustomId = '';
            let placeholder = '';
            let min = 1;
            let max = 1;
            let content = '';
            let bCustomId = '';
            let bLabel = '';
            let emoji = null;
            switch (selectmenu) {
                case 'age':
                    rolenames = ageRoles;
                    smCustomId = 'ageselect';
                    placeholder = 'Wähle dein Alter';
                    content = 'Bitte wähle dein Alter aus:';
                    bCustomId = 'removeAge';
                    bLabel = 'Altersrolle entfernen';
                    break;
                case 'color':
                    rolenames = colorRoles;
                    smCustomId = 'colorselect';
                    placeholder = 'Wähle deine Lieblingsfarbe';
                    content = 'Bitte wähle deine Lieblingsfarbe aus:';
                    bCustomId = 'removeColor';
                    bLabel = 'Farbenrolle entfernen';
                    break;
                case 'dm':
                    rolenames = dmRoles;
                    smCustomId = 'dmselect';
                    placeholder = 'DM-Einstellungen';
                    content = 'Bitte wähle deine DM-Einstellungen aus:';
                    bCustomId = 'removeDm';
                    bLabel = 'DM-Rolle entfernen';
                    emoji = dmEmojis;
                    break;
                case 'game':
                    rolenames = gameRoles;
                    smCustomId = 'gameselect';
                    placeholder = 'Wähle dein Lieblingsspielgenre';
                    content = 'Bitte wähle deine Lieblingsspiele aus:';
                    bCustomId = 'removeGame';
                    bLabel = 'Spielesrolle entfernen';
                    min = 0;
                    max = rolenames.length;
                    break;
                case 'ping':
                    rolenames = pingRoles;
                    smCustomId = 'pingselect';
                    placeholder = 'Ping-Einstellungen';
                    content = 'Bitte wähle deine Ping-Einstellungen aus:';
                    bCustomId = 'removePingRoles';
                    bLabel = 'Pingrollen entfernen';
                    emoji = pingEmojis;
                    break;
                case 'platform':
                    rolenames = platformRoles;
                    smCustomId = 'platformselect';
                    placeholder = 'Wähle deine Plattform';
                    content = 'Bitte wähle deine Plattformen aus:';
                    bCustomId = 'removePlatformRoles';
                    bLabel = 'Plattformrollen entfernen';
                    min = 0;
                    max = rolenames.length;
                    break;
                case 'pronoun':
                    rolenames = pronounRoles;
                    smCustomId = 'pronounselect';
                    placeholder = 'Wähle dein Pronomen';
                    content = 'Bitte wähle dein Pronomen aus:';
                    bCustomId = 'removePronouns';
                    bLabel = 'Pronomensrolle entfernen';
                    min = 0;
                    max = rolenames.length;
                    break;
                case 'region':
                    rolenames = regionRoles;
                    smCustomId = 'regionselect';
                    placeholder = 'Bundesland auswählen';
                    content = 'Bitte wähle dein Bundesland aus:';
                    bCustomId = 'removeRegion';
                    bLabel = 'Bundesland entfernen';
                    break;
                default:
                    throw new Error('Ungültiges SelectMenu gewählt.');
            }
            let roles = [];
            let selectMenu = null;
            if (emoji != null) {
                for (let i = 0; i < rolenames.length; i++) {
                    roles[i] = {
                        label: rolenames[i],
                        value: rolenames[i],
                        emoji: emoji[i]
                    };
                }
                selectMenu = new StringSelectMenuBuilder()
                    .setCustomId(smCustomId)
                    .setPlaceholder(placeholder)
                    .setMinValues(min)
                    .setMaxValues(max)
                    .addOptions(
                        roles.map((role) =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(role.label)
                                .setValue(role.value)
                                .setEmoji(role.emoji)
                        )
                    );
            } else {
                for (let i = 0; i < rolenames.length; i++) {
                    roles[i] = {
                        label: rolenames[i],
                        value: rolenames[i]
                    };
                }
                selectMenu = new StringSelectMenuBuilder()
                    .setCustomId(smCustomId)
                    .setPlaceholder(placeholder)
                    .setMinValues(min)
                    .setMaxValues(max)
                    .addOptions(
                        roles.map((role) =>
                            new StringSelectMenuOptionBuilder()
                                .setLabel(role.label)
                                .setValue(role.value)
                        )
                    );
            }
            const button = new ButtonBuilder()
                .setCustomId(bCustomId)
                .setLabel(bLabel)
                .setStyle('Danger');
            const row = new ActionRowBuilder().addComponents(selectMenu);
            const row2 = new ActionRowBuilder().addComponents(button);
            await interaction.reply({
                content: content,
                components: [row, row2],
            });
        } catch (error) {
            console.log(error);
        }
    },
};