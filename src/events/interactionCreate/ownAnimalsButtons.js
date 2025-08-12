const { MessageFlags, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle } = require('discord.js');
const createAnimalsEmbeds = require("../../utils/createAnimalsEmbeds");
const { tiereDAO } = require('../../utils/daos');

module.exports = async (interaction) => {
    if ((!interaction.isButton() && !interaction.isModalSubmit()) || !interaction.customId || !interaction.customId.includes('ownAnimals')) return;
    let targetMessage = await interaction.channel.messages.fetch(interaction.message.id);
    let targetMessageEmbed = targetMessage.embeds[0];
    let [, pageSlash] = targetMessageEmbed.title.split(" - ");
    let [page, maxpage] = pageSlash.split("/");
    if (interaction.customId === 'ownAnimalsDown') {
        try {
            if (page != 1) {
                let newPage = +page;
                const messageData = await createAnimalsEmbeds(newPage - 2, interaction.guild.id, targetMessageEmbed.footer.text);
                await interaction.update({
                    embeds: [messageData.embed],
                    files: [messageData.file],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf Seite 1.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'ownAnimalsUp') {
        try {
            if (page != maxpage) {
                let newPage = +page;
                const messageData = await createAnimalsEmbeds(newPage, interaction.guild.id, targetMessageEmbed.footer.text);
                await interaction.update({
                    embeds: [messageData.embed],
                    files: [messageData.file],
                    components: [targetMessage.components[0]]
                });
                return;
            } else {
                await interaction.reply({ content: `Du bist bereits auf der letzten Seite.`, flags: MessageFlags.Ephemeral });
                return;
            }
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === 'ownAnimalsRename') {
        if (targetMessageEmbed.footer.text !== interaction.user.id) {
            await interaction.reply({ content: `Du kannst nicht die Tiere anderer umbenennen!`, flags: MessageFlags.Ephemeral });
            return;
        }
        try {
            const name = targetMessageEmbed.description.split("\n")[0].replace("Name: ", "");
            const modal = new ModalBuilder()
                .setTitle(`Umbenennen von ${name}`)
                .setCustomId(`ownAnimalsRename-${name}`);
            const textInput = new TextInputBuilder()
                .setCustomId('rename-input')
                .setLabel('Wie soll das Tier heißen?')
                .setStyle(TextInputStyle.Short)
                .setRequired(true)
                .setMaxLength(30);
            const actionRow = new ActionRowBuilder().addComponents(textInput);
            modal.addComponents(actionRow);
            await interaction.showModal(modal);
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId.includes('ownAnimalsRename-')) {
        try {
            const oldName = interaction.customId.split('-')[1];
            const newName = interaction.fields.getTextInputValue('rename-input');
            console.log(`Umbenennen von ${oldName} in ${newName}`);
            const animal = await tiereDAO.getOneByPfad(oldName);
            if (!animal) {
                await interaction.reply({ content: `Das Tier existiert nicht.`, flags: MessageFlags.Ephemeral });
                return;
            }
            animal.customName = newName;
            await tiereDAO.update(animal);
            await interaction.reply({ content: `${oldName} wurde erfolgreich in ${newName} umbenannt!`, flags: MessageFlags.Ephemeral });
        } catch (error) {
            console.log(error);
        }
    }
};