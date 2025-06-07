const { MessageFlags } = require('discord.js');
const createAnimalsEmbeds = require("../../utils/createAnimalsEmbeds");

module.exports = async (interaction) => {
    if (!interaction.isButton() || !interaction.customId || !interaction.customId.includes('ownAnimals')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [, pageSlash] = targetMessageEmbed.title.split(" - ");
    let [page, maxpage] = pageSlash.split("/");
    if (interaction.customId === 'ownAnimalsDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                const messageData = await createAnimalsEmbeds(newPage - 2, interaction);
                await interaction.update({
                    embeds: [messageData.embed],
                    files: [messageData.file],
                    components: [targetMessage.components[0], targetMessage.components[1]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf Seite 1.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'ownAnimalspUp') {
        try {
            if (page != maxpage) {
                let newPage = +page;
                const messageData = await createAnimalsEmbeds(newPage, interaction);
                await interaction.update({
                    embeds: [messageData.embed],
                    files: [messageData.file],
                    components: [targetMessage.components[0], targetMessage.components[1]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    }
};