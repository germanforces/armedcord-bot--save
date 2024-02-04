require("dotenv").config();
const { Events, EmbedBuilder, ChannelType, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");
const { livechatguildid, livechatparentid } = process.env
const Livechatcreate = require("../../schemas/uint_livechatcreate");
const wait = require("node:timers/promises").setTimeout;
const mongoose = require("mongoose");

module.exports = {
    name: Events.MessageCreate,
    async execute(message, client) {
        if (message.author.bot) return;

        const guild = client.guilds.cache.get(livechatguildid);
        if (!guild) {
            return process.exit();
        }

        const category = guild.channels.cache.find(CAT => CAT.id === livechatparentid || CAT.name === "LIVECHAT");
        const channel = guild.channels.cache.find(
            x => x.name === message.author.username && x.parentId === category.id
        );

        if (message.channel.type == ChannelType.DM) {

            let modmailprofile = await Livechatcreate.findOne({ uid: message.author.id });
            if (!modmailprofile) {
                modmailprofile = new Livechatcreate({
                    _id: new mongoose.Types.ObjectId(),
                    userg: "no userg",
                    uname: message.author.username,
                    uid: message.author.id,
                    reason: `${message.content || "no messeage content"}`,
                    endreason: "no endreason",
                    channelId: "no channelid"
                })
                await modmailprofile.save();
               
            } 
            
            if (!channel) {
                let embedDM = new EmbedBuilder()
                    .setTitle("Live-Chat Anfrage")
                    .setDescription("# Stelle deine Frage im Live-Chat. #")
                    .setThumbnail(message.author.displayAvatarURL())
                    .setColor("Green")
                    .setFooter({
                        text: `© 2023 - ${client.user.username}`,
                        iconURL: message.author.displayAvatarURL()
                    })

                if (message.attachments.size) return;

                message.reply(
                    {
                        embeds: [
                            embedDM
                        ],
                        components: [
                            new ActionRowBuilder()
                                .addComponents(
                                    new ButtonBuilder()
                                        .setCustomId("uint_openlivechat")
                                        .setLabel("Chat starten")
                                        .setStyle(ButtonStyle.Success),

                                    new ButtonBuilder()
                                        .setCustomId("uint_cancellivechat")
                                        .setLabel("Abbruch")
                                        .setStyle(ButtonStyle.Danger)

                                )
                        ]
                    }
                )

            } else {
            
                let embed = new EmbedBuilder()
                    .setAuthor({ name:`${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) })
                    .setDescription(message.content.substr(0, 4096) || "no message content")
                    .setColor("Green");

                if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);

                message.react("📨")
                    .catch(() => { });

                return channel.send(
                    {
                        embeds: [
                            embed
                        ]
                    }
                );
                

            }

        } else if (message.channel.type === ChannelType.GuildText) {
            if (message.channel.parentId === category.id) {
                if (message.content.startsWith('a!')) return;

                let modmailprofile = await Livechatcreate.findOne({ channelid: message.channel.id })

                let embed = new EmbedBuilder()
                .setDescription(message.content.substr(0, 4096) || "no message content")

                if (message.attachments.size) embed.setImage(message.attachments.map(img => img)[0].proxyURL);
                if (message.author.id === "455469757467066369") embed.setAuthor({ name: `Gründer -> ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }) && embed.setColor("Yellow")
                if (message.author.id === "1026248891374518343") embed.setAuthor({ name: `Admin -> ${message.author.username}`, iconURL: message.author.displayAvatarURL({ dynamic: true }) }) && embed.setColor("Red")
            
                message.react("📨")
                    .catch(() => { });
                client.users.cache.get(modmailprofile.uid).send({ content: "Du hast eine Antwort auf dein Anliegen erhalten... <a:amc_loading:1175914565540790443>" }).then(msg => {
                    setTimeout(() => msg.delete(), 5000)
                })

                await wait(5000)
                return client.users.cache.get(modmailprofile.uid).send(
                    {
                        embeds: [
                            embed
                        ]
                    }
                ).catch(() => { });
            } else return;
        }




    }
}