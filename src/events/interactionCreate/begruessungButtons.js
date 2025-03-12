const Begruessung = require('../../models/Begruessung');
const { MessageFlags } = require('discord.js');

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('begruessung') || (!interaction.customId.includes('approve') && !interaction.customId.includes('reject'))) return;
    try {
        const [type, userid, action] = interaction.customId.split('.');
        if (!type || !userid || !action) return;
        if (type !== 'begruessung') return;
        await interaction.deferReply({ flags: MessageFlags.Ephemeral });
        const targetBegruessung = await Begruessung.findOne({ authorId: userid });
        if (!targetBegruessung) {
            console.log('ERROR begrüßung nicht vorhanden');
            interaction.editReply('ERROR Irgendwas passt nicht.');
            return;
        }
        if (targetBegruessung.zugestimmt != 'X') {
            interaction.editReply(`Die Begrüßung wurde bereits auf ${targetBegruessung.zugestimmt} gesetzt!`);
            return;
        }
        const targetUserObj = await interaction.guild.members.fetch(userid);
        if (action === 'approve') {
            targetBegruessung.zugestimmt = 'J';
            await targetBegruessung.save();
            interaction.editReply('Begrüßung zugestimmt!');
            targetUserObj.send('Deine Begrüßung wurde aktiviert.');
            return;
        }
        if (action === 'reject') {
            targetBegruessung.zugestimmt = 'N';
            await targetBegruessung.save();
            interaction.editReply('Begrüßung abgelehnt!');
            targetUserObj.send('Deine Begrüßung wurde abgelehnt, wende dich an Admins bzgl. der Gründe.');
            return;
        }
    } catch (error) {
        console.log(error);
    }
};