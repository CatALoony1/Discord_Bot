const Suggestion = require('../../models/Suggestion');
const formatResults = require('../../utils/formatResults');
const { MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('suggestion')) return;
    try {
        const [type, suggestionId, action] = interaction.customId.split('.');
        if (!type || !suggestionId || !action) return;
        if (type !== 'suggestion') return;
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const targetSuggestion = await Suggestion.findOne({ suggestionId })
        const targetMessage = await interaction.channel.messages.fetch(targetSuggestion.messageId);
        const targetMessageEmbed = targetMessage.embeds[0];
        if (action === 'approve') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply('Du darfst das nicht, frage einen Admin.');
                return;
            }
            targetSuggestion.status = 'zugestimmt';
            targetMessageEmbed.data.color = 0x008000;
            targetMessageEmbed.fields[1].value = '✅Zugestimmt';
            await targetSuggestion.save();
            interaction.editReply('Vorschlag zugestimmt!');
            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [],
            })
            return;
        }
        if (action === 'reject') {
            if (!interaction.memberPermissions.has('Administrator')) {
                await interaction.editReply('Du darfst das nicht, frage einen Admin.');
                return;
            }
            targetSuggestion.status = 'abgelehnt';
            targetMessageEmbed.data.color = 0xff0000;
            targetMessageEmbed.fields[1].value = '❌Abgelehnt';
            await targetSuggestion.save();
            interaction.editReply('Vorschlag abgelehnt!');
            targetMessage.edit({
                embeds: [targetMessageEmbed],
                components: [],
            })
            return;
        }
        if (action === 'upvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
            if (hasVoted) {
                await interaction.editReply('Du hast bereits abgestimmt.');
                return;
            }
            if (targetSuggestion.status !== 'laufend') {
                await interaction.editReply(`Der Vorschlag wurde bereits ${targetSuggestion.status}.`);
                return;
            }
            targetSuggestion.upvotes.push(interaction.user.id);
            await targetSuggestion.save();
            interaction.editReply('Upvote abgegeben!');
            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );
            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });
            return;
        }
        if (action === 'downvote') {
            const hasVoted = targetSuggestion.upvotes.includes(interaction.user.id) || targetSuggestion.downvotes.includes(interaction.user.id);
            if (hasVoted) {
                await interaction.editReply('Du hast bereits abgestimmt.');
                return;
            }
            if (targetSuggestion.status !== 'laufend') {
                await interaction.editReply(`Der Vorschlag wurde bereits ${targetSuggestion.status}.`);
                return;
            }
            targetSuggestion.downvotes.push(interaction.user.id);
            await targetSuggestion.save();
            interaction.editReply('Downvote abgegeben!');
            targetMessageEmbed.fields[2].value = formatResults(
                targetSuggestion.upvotes,
                targetSuggestion.downvotes,
            );
            targetMessage.edit({
                embeds: [targetMessageEmbed],
            });
            return;
        }
    } catch (error) {
        console.log(error);
    }
};