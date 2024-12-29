module.exports = async (guildMember) => {
    const role = guildMember.guild.roles.cache.find(role => role.name === 'Landratte');
    await guildMember.guild.members.cache.get(guildMember.id).roles.add(role);
};