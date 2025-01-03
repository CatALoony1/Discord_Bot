const Discord = require("discord.js");
const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/formatResults');

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `suggestion-${interaction.user.id}`) {
        await interaction.deferReply({ ephemeral: true })
        let suggestionMessage;
        try {
            suggestionMessage = await interaction.channel.send('Vorschlag wird erstellt, bitte warten...');
        } catch (error) {
            interaction.editReply('Ich konnte den Vorschlag in diesem Channel nicht erstellen. Mir fehlen möglicherweise Berechtigungen.');
            return;
        }
        const suggestionText = interaction.fields.getTextInputValue('suggestion-input');
        const newSuggestion = new Suggestion({
            authorId: interaction.user.id,
            guildId: interaction.guildId,
            messageId: suggestionMessage.id,
            content: suggestionText,
        });
        await newSuggestion.save();
        interaction.editReply('Vorschlag erstellt!');
        const suggestionEmbed = new Discord.EmbedBuilder()
            .setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }), })
            .addFields({ name: 'Vorschlag', value: suggestionText })
            .addFields({ name: 'Status', value: '⏳Laufend' })
            .addFields({ name: 'Votes', value: formatResults() })
            .setColor(0x0033cc);
        const upvoteButton = new Discord.ButtonBuilder()
            .setEmoji('👍')
            .setLabel('Upvote')
            .setStyle(Discord.ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.upvote`);
        const downvoteButton = new Discord.ButtonBuilder()
            .setEmoji('👎')
            .setLabel('Downvote')
            .setStyle(Discord.ButtonStyle.Primary)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.downvote`);
        const approveButton = new Discord.ButtonBuilder()
            .setEmoji('✅')
            .setLabel('Zustimmen')
            .setStyle(Discord.ButtonStyle.Success)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.approve`);
        const rejectButton = new Discord.ButtonBuilder()
            .setEmoji('🗑️')
            .setLabel('Ablehnen')
            .setStyle(Discord.ButtonStyle.Danger)
            .setCustomId(`suggestion.${newSuggestion.suggestionId}.reject`);
        const firstRow = new Discord.ActionRowBuilder().addComponents(upvoteButton, downvoteButton);
        const secondRow = new Discord.ActionRowBuilder().addComponents(approveButton, rejectButton);
        suggestionMessage.edit({
            content: `${interaction.user} Vorschlag erstellt!`,
            embeds: [suggestionEmbed],
            components: [firstRow, secondRow]
        })
    }
};