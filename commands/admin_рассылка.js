const dc = require("../commandlib/discord_command.js");
const discord = require('discord.js');
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");

class CommandMailingList extends dc.DiscordCommand {
    // constructor
    constructor(cmdName, cmdDescription) { super(cmdName, cmdDescription) }

    /**
    * **Run command.**
    * @param {discord.Interaction} interaction Interaction.
    */
    async run(interaction) {
        super.run(interaction);

        let msg = await interaction.options._hoistedOptions.find(option => option.name === 'текст').value;
        let attachment = interaction.options.getAttachment("вложение");

        let members = await interaction.guild.members.fetch();
        
        if (msg.length > 4000) {
            await interaction.reply({
                "content": "**Текст слишком большой!**",
                "ephemeral": true
            })

            return;
        }

        var data = {
            "content": msg
        };

        if (attachment) {
            data["files"] = [{
                "attachment": attachment.url,
                "name": attachment.filename
            }];
        }

        await interaction.reply({
            "content": msg,
            "ephemeral": true
        })

        members.forEach(async (member) => {
            if (member.user.bot) return;

            await member.user.send(data);
        })
        
        return;
    }
}

module.exports = CommandMailingList;
