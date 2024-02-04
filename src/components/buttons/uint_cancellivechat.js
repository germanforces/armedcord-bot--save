const { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const LiveChatcreate = require("../../schemas/uint_livechatcreate");
const wait = require("node:timers/promises").setTimeout;


module.exports = {
    cooldown: 60,
    data: {
        name: `uint_cancellivechat`
    },
    async execute(interaction, client) {
        let modmailprofile = await LiveChatcreate.findOne({ uid: interaction.user.id })

        let uembed = new EmbedBuilder()
            .setTitle("Live Chat wurde abgebrochen")
            .setDescription("# Schön das du dein Anliegen alleine klären konntest! Falls noch etwas offen ist drücke unten auf den Button. #")
            .setColor("Red")
            .setFooter({
                text: `© 2024 - ${modmailprofile.uname} | Id: ${modmailprofile._id}`,
                iconURL: interaction.user.displayAvatarURL()
            })

        await interaction.update({
            embeds: [uembed], components: [
                new ActionRowBuilder()
                    .addComponents(
                        new ButtonBuilder()
                            .setLabel("FAQ Support-Server")
                            .setStyle(ButtonStyle.Link)
                            .setURL("https://discord.com/channels/1175596339921428510/1187901886829973546")
                    )
            ]
        })

        await LiveChatcreate.deleteMany(modmailprofile._id);
        console.log(`${interaction.user.tag} cancelled the live chat.`)
    }
}