const Discord = require("discord.js");
const Begruessung = require('../../models/Begruessung');
require('dotenv').config();

/**
 * 
 * @param {Discord.Interaction} interaction 
 * @returns 
 */
module.exports = async (interaction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === `begruessung-${interaction.user.id}` && !interaction.fields.getTextInputValue('begruessung-text').includes('TESTJG')) {
        try {
            let targetChannel = interaction.guild.channels.cache.get(process.env.ADMIN_C_ID) || (await interaction.guild.channels.fetch(process.env.ADMIN_C_ID));
            await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
            if (interaction.fields.getTextInputValue('begruessung-text').includes('<@')) {
                interaction.editReply('Pings von Nutzern oder Rollen sind nicht erlaubt!');
                return;
            }
            const text = interaction.fields.getTextInputValue('begruessung-text').replaceAll('<me>', `<@${interaction.user.id}>`);
            const begruessungEmbed = new Discord.EmbedBuilder();
            begruessungEmbed.setColor(0x0033cc);
            begruessungEmbed.setAuthor({ name: interaction.user.username, iconURL: interaction.user.displayAvatarURL({ size: 256 }) });
            begruessungEmbed.setTitle(`Begrüßung:`);
            begruessungEmbed.setDescription(text);
            const approveButton = new Discord.ButtonBuilder()
                .setEmoji('✅')
                .setLabel('Zustimmen')
                .setStyle(Discord.ButtonStyle.Success)
                .setCustomId(`begruessung.${interaction.user.id}.approve`);
            const rejectButton = new Discord.ButtonBuilder()
                .setEmoji('🗑️')
                .setLabel('Ablehnen')
                .setStyle(Discord.ButtonStyle.Danger)
                .setCustomId(`begruessung.${interaction.user.id}.reject`);
            const buttonrow = new Discord.ActionRowBuilder().addComponents(approveButton, rejectButton);
            await targetChannel.send({
                embeds: [begruessungEmbed],
                components: [buttonrow]
            });

            const begruessung = await Begruessung.findOne({
                guildId: interaction.guild.id,
                authorId: interaction.user.id,
            });
            if (begruessung) {
                begruessung.content = text;
                begruessung.zugestimmt = "X";
                await begruessung.save();
            } else {
                var welcomeChannel = interaction.guild.channels.cache.get(process.env.WELCOME_ID) || (await interaction.guild.channels.fetch(process.env.WELCOME_ID));
                await welcomeChannel.createWebhook({
                    name: interaction.user.displayName,
                    avatar: interaction.user.displayAvatarURL({ size: 256 }),
                })
                    .then(webhook => new Begruessung({
                        guildId: interaction.guild.id,
                        authorId: interaction.user.id,
                        content: text,
                        webhookId: webhook.id,
                        webhookToken: webhook.token,
                    }).save())
                    .catch(console.error);
            }
            interaction.editReply('Begrüßung zur Überprüfung abgegeben.');
        } catch (error) {
            console.log(error);
        }
    } else if (interaction.customId === `begruessung-${interaction.user.id}`) {
        await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });
        try {
            const authorId = interaction.fields.getTextInputValue('begruessung-text');
            const [ ,channelID, userID] = interaction.fields.getTextInputValue('begruessung-text').split(';');
            let targetChannel = interaction.guild.channels.cache.get(channelID) || (await interaction.guild.channels.fetch(channelID));
            const begruessung = await Begruessung.findOne({
                guildId: interaction.guild.id,
                authorId: authorId,
            });
            if (begruessung) {
                await interaction.editReply('Die Begrüßung wurde bereits eingetragen.');
            } else {
                const targetMember = interaction.guild.members.cache.get(userID) || (await interaction.guild.members.fetch(userID));
                await targetChannel.createWebhook({
                    name: targetMember.displayName,
                    avatar: targetMember.displayAvatarURL({ size: 256 }),
                })
                    .then(webhook => new Begruessung({
                        guildId: interaction.guild.id,
                        authorId: authorId,
                        content: `Webhook für ${targetMember.displayName} in ${targetChannel.name}`,
                        webhookId: webhook.id,
                        webhookToken: webhook.token,
                    }).save())
                    .catch(console.error);
            }
            interaction.editReply('Begrüßung zur Überprüfung abgegeben.');
        } catch (error) {
            console.log(error);
        }
    }
};