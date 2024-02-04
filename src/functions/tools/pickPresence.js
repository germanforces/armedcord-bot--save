const { ActivityType, Presence } = require("discord.js");

module.exports = (client) => {
    client.pickPresence = async () => {
        const options = [{
            type: ActivityType.Playing,
            text: "/help - testphase...",
            status: "online"

        },
        {
            type: ActivityType.Playing,
            text: "Der Wille entscheidet",
            status: "dnd"

        },
        ];
        // random pick
        const option = Math.floor(Math.random() * options.length);

        client.user.setPresence({
            activities: [{
                name: options[option].text,
                type: options[option].type
            }],
            status: options[option].status
        })

    }
}