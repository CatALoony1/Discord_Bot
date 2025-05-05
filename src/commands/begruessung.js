const { SlashCommandBuilder, InteractionContextType, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder, MessageFlags } = require('discord.js');
const Begruessung = require('../models/Begruessung');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('begruessung')
        .setDescription('Begrüßung')
        .addSubcommand(subcommand =>
            subcommand
                .setName('add')
                .setDescription('Stelle deine Begrüßung ein.')
        )
        .addSubcommand(subcommand =>
            subcommand
                .setName('remove')
                .setDescription('Deaktiviert deine Begrüßung.')
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),
    run: async ({ interaction }) => {
        console.log(`SlashCommand ${interaction.commandName} ${interaction.options.getSubcommand()} was executed by user ${interaction.member.user.tag}`);
        try {
            const subcommand = interaction.options.getSubcommand();
            if (subcommand == 'add') {
                const modal = new ModalBuilder()
                    .setTitle('Deine Begrüßung:')
                    .setCustomId(`begruessung-${interaction.user.id}`);
                const textInput = new TextInputBuilder()
                    .setCustomId('begruessung-text')
                    .setLabel('Begrüßung:')
                    .setPlaceholder('Placeholders:\n<me> - du\n<new> - der/die neue\n <#CHANNELID> - CHANNELID ersetzen')
                    .setStyle(TextInputStyle.Paragraph)
                    .setRequired(true)
                    .setMaxLength(200);
                const firstActionRow = new ActionRowBuilder().addComponents(textInput);
                modal.addComponents(firstActionRow);
                await interaction.showModal(modal);
            } else {
                await interaction.deferReply({ flags: MessageFlags.Ephemeral });
                const targetBegruessung = await Begruessung.findOne({ authorId: interaction.user.id, guildId: interaction.guild.id });
                if (targetBegruessung) {
                    targetBegruessung.zugestimmt = 'N';
                    targetBegruessung.save();
                    interaction.editReply(`Begrüßung deaktiviert.`);
                } else {
                    interaction.editReply(`Du hast keine Begrüßung eingetragen.`);
                }
            }
        } catch (err) {
            console.log(err);
        }
    },
};