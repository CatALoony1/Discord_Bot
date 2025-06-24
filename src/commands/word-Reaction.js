const { SlashCommandBuilder, MessageFlags, InteractionContextType } = require('discord.js');
const { letterEmojiMap } = require('../utils/letterEmojiMap');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('word-reaction')
        .setDescription('Reagiere mit Buchstaben auf eine Nachricht.')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('NachrichtID')
                .setMinLength(18)
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('wort')
                .setDescription('Nur A-Z ! ?')
                .setMaxLength(10)
                .setRequired(true)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag} with value ${interaction.options.get('wort').value}`);
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const regex = /^[A-Z!?]+$/i;
            const word = interaction.options.get('wort').value.trim();
            if (!regex.test(word)) {
                await interaction.editReply('Das übergebene Wort enthält Zeichen die nicht zugelassen sind.');
                return;
            }
            const wordArray = Array.from(word, zeichen => zeichen.toUpperCase());
            const id = interaction.options.get('messageid').value;
            const fetchedMessage = await interaction.channel.messages.fetch(id);
            for (const key of wordArray) {
                await fetchedMessage.react(letterEmojiMap.get(key));
            }
            await interaction.editReply('Erledigt!');
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: false,
        deleted: true
    },
};