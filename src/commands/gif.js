const { SlashCommandBuilder, InteractionContextType, MessageFlags } = require('discord.js');
const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
require('dotenv').config();

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Sendet ein zufälliges gif zu einem Begriff.')
        .addStringOption(option =>
            option.setName('suchwort')
                .setDescription('Suchwort')
                .setMinLength(1)
                .setRequired(true)
        )
        .setContexts([InteractionContextType.Guild, InteractionContextType.PrivateChannel]),

    run: async ({ interaction, client }) => {
        console.log(`SlashCommand ${interaction.commandName} was executed by user ${interaction.member.user.tag}`);
        const suchwort = interaction.options.get('suchwort').value;
        const regex = /^[A-Z]+$/i;
        if (!regex.test(suchwort)) {
            await interaction.deferReply({ flags: MessageFlags.Ephemeral });
            await interaction.editReply('Das übergebene Wort enthält Zeichen die nicht zugelassen sind.');
            return;
        }
        try {
            var apikey = process.env.TENOR_API;
            var clientkey = "CaptainIglo";
            var lmt = 1;
            var search_term = suchwort;

            var search_url = "https://tenor.googleapis.com/v2/search?q=" + search_term + "&key=" +
                apikey + "&client_key=" + clientkey + "&limit=" + lmt;
            var gif = httpGetAsync(search_url,tenorCallback_search);
            console.log(gif);
        } catch (error) {
            console.log(error);
        }
    },
    options: {
        devOnly: true,
    },
};

function tenorCallback_search(responsetext)
{
    var response_objects = JSON.parse(responsetext);

    gifs = response_objects["results"];
    console.log(gifs[0]["media_formats"]["gif"]["url"]);
    return gifs[0]["media_formats"]["gif"]["url"];

}

function httpGetAsync(theUrl, callback)
{
    var xmlHttp = new XMLHttpRequest();
    var gif = undefined;
    xmlHttp.onreadystatechange = function()
    {
        console.log(xmlHttp);
        if (xmlHttp.readyState == 4 && xmlHttp.status == 200)
        {
            gif = callback(xmlHttp.responseText);
        }
    }
    xmlHttp.open("GET", theUrl, true);
    xmlHttp.send(null);
    console.log(gif);
    return gif;
}

