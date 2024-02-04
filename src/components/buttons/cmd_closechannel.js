require("dotenv").config();
const { EmbedBuilder } = require("discord.js");
const LiveChatcreate = require("../../schemas/uint_livechatcreate");
const wait = require("node:timers/promises").setTimeout;


module.exports = {
    cooldown: 60,
    data: {
        name: `cmd_closechannel`
    },
    async execute(interaction, client) { 
        let modmailprofile = await LiveChatcreate.findOne({ uname: interaction.channel.name })
        let u = modmailprofile.uid
       
        let uembed = new EmbedBuilder()
        .setTitle("Live Chat wurde geschlossen")
        .setDescription("Falls noch etwas offen ist, schau hier vorbei: https://discord.com/channels/1175596339921428510/1187901886829973546")
        .setColor("Red")
        .setFooter({
            text: `© 2024 - ${modmailprofile.uname} | Id: ${modmailprofile._id}`
        })
        await interaction.reply({content:`Id ${modmailprofile._id} wird geschlossen...`})
        await wait(5000)

        await client.users.cache.get(u).send({ embeds: [uembed] })
        await interaction.channel.delete()

        await LiveChatcreate.deleteMany(modmailprofile._id);
    }
}