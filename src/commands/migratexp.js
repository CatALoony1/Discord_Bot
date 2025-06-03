const { ActionRowBuilder, PermissionFlagsBits, SlashCommandBuilder, ButtonBuilder, InteractionContextType } = require('discord.js');


module.exports = {
    data: new SlashCommandBuilder()
        .setName('migratexp')
        .setDescription('Erzeugt ein Rollenselect.')
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
            const content = `Wir stellen nun auf GELD um.\n Jedem stehen initial 2 Möglichkeiten zur Verfügung.\n 1. Ihr könnt eure XP in GELD umwandeln.\n 2. Ihr könnt eure XP behalten(GELD könnt ihr trotzdem verdienen).\n\nBitte wählt eine der Optionen unten aus, um Zugriff auf den Channel für's GELD zu erhalten.\n(Dieser Schritt kann nichr rückgängig gemacht werden! Tauschverhältnis 1XP = 2GELD)`;
            const button = new ButtonBuilder()
                .setCustomId('migratexp')
                .setLabel('XP umwandeln')
                .setStyle('Danger');
            const button2 = new ButtonBuilder()
                .setCustomId('notmigratexp')
                .setLabel('XP behalten')
                .setStyle('Danger');
            const row = new ActionRowBuilder().addComponents(button, button2);
            await interaction.reply({
                content: content,
                components: [row],
            });
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
        deleted: false
    },
};