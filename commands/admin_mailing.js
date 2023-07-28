const dc = require("../commandlib/discord_command.js");
const discord = require('discord.js');
const { ActionRowBuilder, EmbedBuilder, ButtonBuilder } = require("discord.js");
const glob = require("../global");

class CommandMailingListEN extends dc.DiscordCommand {
    // constructor
    constructor(cmdName, cmdDescription) { 
        super(cmdName, cmdDescription)

        this._registerAction("cancel-button-en");
    }

    /**
     * Action callback
     * @param {discord.Interaction} interaction Interaction;
     * @param {string} actionid Action ID
     */
    async onActionPress(interaction, actionid) {
        switch (actionid) {
            case "cancel-button-en": {
                let i = 0;
                
                // glob.getMessageList().forEach((msg) => {
                //     if (msg[0] == interaction.user.id) {
                //         glob.getMessageList().splice(i, 1);
                //     }

                //     i++;
                // })

                while (i < glob.getMessageList().length) {
                    var obj = glob.getMessageList()[i];

                    if (obj[0] == interaction.user.id) {
                        glob.getMessageList().splice(i, 1);
                    }

                    i++;
                }

                interaction.reply({
                    "content": "Mailing action has been canceled",
                    "ephemeral": true
                })

                break;
            }
        }
    }


    /**
    * **Run command.**
    * @param {discord.Interaction} interaction Interaction.
    */
    async run(interaction) {
        super.run(interaction);

        let i = 0;

        while (i < glob.getMessageList().length) {
            var obj = glob.getMessageList()[i];

            if (obj[0] == interaction.user.id) {
                interaction.reply({
                    "content": "**You already started mailing process!**\nClick on `Cancel Mailing` button in previous message to cancel mailing process.",
                    "ephemeral": true
                })
                
                return;
            }

            i++;
        }

        let attachment = interaction.options.getAttachment("attachment");

        var data = {
            
        };

        if (attachment) {
            data["files"] = [{
                "attachment": attachment.url,
                "name": attachment.filename
            }];
        }

        glob.getMessageList().push([interaction.user.id, data, interaction]);

        const row = new ActionRowBuilder()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId('cancel-button-en')
                    .setStyle(discord.ButtonStyle.Danger)
                    .setLabel('Cancel Mailing'),
        )

        await interaction.reply({
            "embeds": [
                {
                  "type": "rich",
                  "title": `Send message you need to send`,
                  "description": "",
                  "color": 0x39AECF
                }
            ],
            "ephemeral": true,
            "components": [row]
        });
        
        return;
    }
}

module.exports = CommandMailingListEN;
