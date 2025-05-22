require('dotenv').config();
module.exports = async (guildMember) => {
    const role = guildMember.guild.roles.cache.get(process.env.NEWMEMBER_ROLE_ID);
    await guildMember.guild.members.cache.get(guildMember.id).roles.add(role);
};