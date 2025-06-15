const { ApplicationCommandType } = require("discord.js");

module.exports = {
    data: {
        name: 'owoify',
        type: ApplicationCommandType.Message,
    },
    run: async ({ interaction }) => {
        try {
            interaction.deferReply();
            const content = interaction.targetMessage.content;
            const fetch = await import('node-fetch').then(module => module.default);
            const apiUrl = 'https://nekos.life/api/v2/owoify';
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ text: content })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            const data = await response.json();
            if (data.owo) {
                await interaction.editReply(data.owo);
            } else {
                await interaction.editReply('Dies hat nicht funktioniert!');
            }
        } catch (e) {
            console.log(e);
        }
    },
};