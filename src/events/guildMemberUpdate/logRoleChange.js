require('dotenv').config();
const { EmbedBuilder } = require('discord.js');
module.exports = async (oldMember, newMember) => {
    try {
        const targetChannel = newMember.guild.channels.cache.get(process.env.LOG_ID) || (await newMember.guild.channels.fetch(process.env.LOG_ID));
        if (!targetChannel) {
            console.log('Fehler, Verlassenschannel gibts nicht');
            return;
        }
        if (oldMember.roles.cache.size > newMember.roles.cache.size) {
            const roleRemoved = new EmbedBuilder();
            roleRemoved.setColor(0xff0000);
            roleRemoved.setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ size: 256 }) });
            roleRemoved.setTimestamp(Date.now());
            oldMember.roles.cache.forEach(role => {
                if (!newMember.roles.cache.has(role.id)) {
                    roleRemoved.setTitle('Role Removed');
                    roleRemoved.setDescription(`${role}`);
                }
            });

            targetChannel.send({ embeds: [roleRemoved] });
        } else if (oldMember.roles.cache.size < newMember.roles.cache.size) {
            const roleAdded = new EmbedBuilder();
            roleAdded.setColor(0x008000);
            roleAdded.setAuthor({ name: newMember.user.username, iconURL: newMember.user.displayAvatarURL({ size: 256 }) });
            roleAdded.setTimestamp(Date.now());
            newMember.roles.cache.forEach(role => {
                if (!oldMember.roles.cache.has(role.id)) {
                    roleAdded.setTitle('Role Added');
                    roleAdded.setDescription(`${role}`);
                }
            });
            targetChannel.send({ embeds: [roleAdded] });
        }
    } catch (error) {
        console.log(error);
    }
};