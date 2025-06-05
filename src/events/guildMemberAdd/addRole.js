require('dotenv').config();
module.exports = async (guildMember) => {
    const role = guildMember.guild.roles.cache.get(process.env.NEWMEMBER_ROLE_ID);
    await guildMember.guild.members.cache.get(guildMember.id).roles.add(role);
    const roleSpiele = guildMember.guild.roles.cache.get('1379457961931309137'); //Spielkind
    await guildMember.guild.members.cache.get(guildMember.id).roles.add(roleSpiele);
};