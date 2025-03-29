const { SlashCommandBuilder, MessageFlags } = require('discord.js');
require('dotenv').config();
const { letterEmojiMap } = require('../utils/letterEmojiMap');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('schmutz')
        .setDescription('SCHMUTZ')
        .addStringOption(option =>
            option.setName('messageid')
                .setDescription('NachrichtID')
                .setMinLength(18)
                .setRequired(true)
        ),

    run: async ({ interaction }) => {
        if (interaction.user.id != process.env.ADMIN_ID) {
            interaction.reply('Du darfst das nicht!!!!');
            return;
        }
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        try {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            const id = interaction.options.get('messageid').value;
            const fetchedMessage = await interaction.channel.messages.fetch(id);
            await fetchedMessage.react(letterEmojiMap.get('S'));
            await fetchedMessage.react(letterEmojiMap.get('C'));
            await fetchedMessage.react(letterEmojiMap.get('H'));
            await fetchedMessage.react(letterEmojiMap.get('M'));
            await fetchedMessage.react(letterEmojiMap.get('U'));
            await fetchedMessage.react(letterEmojiMap.get('T'));
            await fetchedMessage.react(letterEmojiMap.get('Z'));
            await interaction.editReply('Erledigt!');
        } catch (err) {
            console.log(err);
        }
    },
    options: {
        devOnly: true,
        deleted: true,
    },
};