require("dotenv").config();
const { EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { livechatguildid, livechatparentid, livechatlogschannelid } = process.env
const Livechatcreate = require("../../schemas/uint_livechatcreate");
const wait = require("node:timers/promises").setTimeout;


module.exports = {
    cooldown: 60,
    data: {
        name: `uint_openlivechat`
    },
    async execute(interaction, client) {
        const guild = client.guilds.cache.get(livechatguildid);
        if (!guild) return;

        const logchannel = guild.channels.cache.get(livechatlogschannelid);

        const category = guild.channels.cache.find(CAT => CAT.id === livechatparentid || CAT.name === "LIVECHAT");
        const channel = await guild.channels.create({
            name: interaction.user.tag,
            type: ChannelType.GuildText,
            parent: category,
        }).catch(console.error);

        let modmailprofile = await Livechatcreate.findOneAndUpdate({ uid: interaction.user.id }, { $set: { channelid: channel.id } })

        let embeddm = new EmbedBuilder()
            .setTitle("Live Chat wurde geöffnet")
            .setDescription("# Unser Support Team wird sich in kürze bei dir melden! #")
            .setThumbnail(interaction.user.displayAvatarURL())
            .addFields(
                { name: "Grund:", value: `${modmailprofile.reason}` },
            )
            .setColor("Green")
            .setFooter({
                text: `© 2024 - ${modmailprofile.uname} ⎮ Id: ${modmailprofile._id}`,
                iconURL: interaction.user.displayAvatarURL()
            })

        const embed = new EmbedBuilder()
            .setThumbnail(interaction.user.displayAvatarURL())
            .setTitle("Live Chat System")
            .setDescription("Ein Mitglied beansprucht Support, für details siehe unten:")
            .addFields(
                { name: "Benutzer:", value: `${modmailprofile.uname} (${modmailprofile.uid})` },
                { name: "Grund:", value: `${modmailprofile.reason}` },
            )
            .setColor("Green")
            .setFooter({
                text: `© 2024 - ${modmailprofile.uname} | Id: ${modmailprofile._id}`,
                iconURL: interaction.user.displayAvatarURL()
            })

        const embedstaff = new EmbedBuilder()
            .setAuthor({ name: `System -> ${client.user.username}`, iconURL: client.user.displayAvatarURL({ dynamic: true }) })
            .setDescription("# Grüße dich! Willkommen im Live Chat Support. #\n\nIch werde nun deine Nachrichten direkt an das Support Team weitleiten, schreib also einfach hier weiter. Achte auf unsere Supportzeiten, außerhalb dessen wird eine Rückmeldung mehr Zeit in anspruch nehmen: https://discord.com/channels/1175596339921428510/1182438060466647101")
            .setColor("Grey")

        await interaction.update({
            embeds: [embeddm], components: [
                new ActionRowBuilder()
                .addComponents(
                    new ButtonBuilder()
                        .setLabel("FAQ Support-Server")
                        .setStyle(ButtonStyle.Link)
                        .setURL("https://discord.com/channels/1175596339921428510/1187901886829973546")
                )
            ]
        })

        channel.send(
            {
                content: "<@&1175596476907393065>",
                embeds: [
                    embed
                ],
                components: [
                    new ActionRowBuilder()
                        .addComponents(
                            new ButtonBuilder()
                                .setCustomId("cmd_closechannel")
                                .setLabel("Schließe Chat")
                                .setStyle(ButtonStyle.Danger),
                        )
                ]
            }
        ).then(async (sent) => {
            sent.pin()
                .catch(() => { });
        });

        await wait(5000)
        await interaction.channel.send({ embeds: [embedstaff] })

        const logembed = new EmbedBuilder()
            .setAuthor({ name: "LOGGING", iconURL: "https://cdn.discordapp.com/emojis/910631120368971836.webp?size=240&quality=lossless" })
            .setTitle("uint_openlivechat")
            .setColor("Green")
            .addFields(
                { name: "Benutzer:", value: `${modmailprofile.uname} (${modmailprofile.uid})` },
                { name: "Grund:", value: `${modmailprofile.reason}` },
                { name: "Id:", value: `${modmailprofile._id}` },
            )
            .setFooter({
                text: `© 2024 - ${client.user.username}`,
                iconURL: client.user.displayAvatarURL()
            });

        await logchannel.send({ embeds: [logembed] })

    }
}