const Discord = require("discord.js");
const Question = require('../../models/QuizQuestion');

module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `qvorschlag-${interaction.user.id}`) {
        const targetUser = await interaction.guild.members.fetch(process.env.ADMIN_ID);
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral })
        const frage = interaction.fields.getTextInputValue('qvorschlag-frage');
        const richtig = interaction.fields.getTextInputValue('qvorschlag-richtig');
        const falsch1 = interaction.fields.getTextInputValue('qvorschlag-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('qvorschlag-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('qvorschlag-falsch3');
        const vorschlag = new Discord.EmbedBuilder();
        vorschlag.setColor(0x0033cc);
        vorschlag.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
        vorschlag.setTitle(`Fragen Vorschlag`);
        vorschlag.setDescription(frage);
        vorschlag.addFields({ name: `Richig:`, value: `${richtig}` });
        vorschlag.addFields({ name: `Falsch1:`, value: `${falsch1}` });
        vorschlag.addFields({ name: `Falsch2:`, value: `${falsch2}` });
        vorschlag.addFields({ name: `Falsch3:`, value: `${falsch3}` });
        await targetUser.send({ embeds: [vorschlag] });
        interaction.editReply('Frage abgegeben!');
    } else if (interaction.customId.includes(`qaddbyadmin-${interaction.user.id}`)) {
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral })
        const frage = interaction.fields.getTextInputValue('qaddbyadmin-frage');
        const richtig = interaction.fields.getTextInputValue('qaddbyadmin-richtig');
        const falsch1 = interaction.fields.getTextInputValue('qaddbyadmin-falsch1');
        const falsch2 = interaction.fields.getTextInputValue('qaddbyadmin-falsch2');
        const falsch3 = interaction.fields.getTextInputValue('qaddbyadmin-falsch3');
        const [type, adminId, mentionedUserId] = interaction.customId.split('-');
        const wrong = `${falsch1}/${falsch2}/${falsch3}`
        const participants = [];
        participants[0] = mentionedUserId;
        const newQuestion = new Question({
            question: frage,
            right: richtig,
            wrong: wrong,
            participants: participants
        });
        await newQuestion.save();
        interaction.editReply('Frage eingetragen!');
    }

};