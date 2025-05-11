const { ApplicationCommandType } = require("discord.js");
const translatte = require('translatte');

module.exports = {
    data: {
        name: 'translate',
        type: ApplicationCommandType.Message,
    },
    run: async ({ interaction }) => {
        try {
            interaction.deferReply();
            const res = await translatte(interaction.targetMessage.content, { to: 'de' });
            await interaction.editReply(res.text);
        } catch (e) {
            console.log(e);
        }
    },
};