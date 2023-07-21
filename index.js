const discord = require('discord.js');
const { Client, GatewayIntentBits, Events, InteractionType } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { Routes } = require('discord-api-types/v9');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path')
const express = require("express");
const express_fs = require("express-fileupload");
const app = express();

// Менеджер команд
const commandManager = require("./commandlib/discord_command.js");
const { isNullOrUndefined } = require('util');

const folderPath = "./commands";

const files = fs.readdirSync(folderPath);

let commands = [];
let commandList = [];

// Получение переменных из .env
dotenv.config();

// Получение всех нужных переменных из .env
const botToken = process.env.TOKEN;
const clientId = process.env.CLIENT_ID;
const port = process.env.PORT;
// const guildId = process.env.GUILD_ID;

// Инициализация клиента
const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        // GatewayIntentBits.DirectMessages,
        // GatewayIntentBits.GuildMessages,
        // GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMembers,
        // GatewayIntentBits.GuildIntegrations,
        // GatewayIntentBits.GuildPresences,
    ],
});

const isNull = (obj) => {
    const str = `${obj}`

    return (str == `null`) || (str == `undefined`)
}

app.use(express.json());
app.use(express.urlencoded({
    extended: true
}))
app.use(express_fs());
app.post("/api/v1/send", async (req, res) => {
    const body = req.body;
    const guild = body.guild;
    
    var discord_guild;
    var failed = false;

    if (req.files && req.files.attachment) {
        if ((Buffer.byteLength(req.files.attachment.data) / 1024 / 1024) > 20) {
            res.send({
                success: false,
                error: "File is too big"
            }).status(413);
            
            return;
        }
    }
    
    if (body.text) {
        if (body.text.length > 4000) {
            res.send({
                success: false,
                error: "Text is too big"
            })

            return;
        }
    }

    try {
        discord_guild = await client.guilds.fetch(guild);
    } catch (e) {
        res.send({
            success: false,
            error: "Unknown guild"
        });
        failed = true;
    }

    if (failed) return;

    if (!isNull(discord_guild.members)) {
        try {
            const members = await discord_guild.members.fetch();
         
            var data = {
                "content": body.text
            }
            if (req.files && req.files.attachment) {
                const attachment = new discord.AttachmentBuilder(req.files.attachment.data, {
                    "name": req.files.attachment.name
                });
                data["files"] = [attachment];
            }

            members.forEach(async (member) => {
                if (member.user.bot) return;

                await member.user.send(data);
            })

            res.send({
                success: true
            }).status(200);
        } catch (e) {
            res.status(500).send({
                success: false,
                error: `${e}`
            });
        }
    } else {
        res.status(404).send({
            success: false,
            error: "Unknown guild"
        });
    }
})

// Получение списка команд
files.forEach((file) => {
    if (file.startsWith("command_")) {
        const commandname = file.split(/[_.]/)[1];
        let cmd = commandManager.createCommand(commandname);
        cmd.client = client;
        commandList.push(cmd);
    }
    else if (file.startsWith("admin_")) {
        const commandname = file.split(/[_.]/)[1];
        let cmd = commandManager.createCommand(commandname, 'admin');
        cmd.client = client;
        commandList.push(cmd);
    }
});

for (let i = 0; i < commandList.length; i++) {
    const obj = commandList[i];
    commands.push(obj.generateCommand());
}

client.on(Events.InteractionCreate, async (interaction) => {
    if (interaction.isButton()) { // событие при нажатии на кнопку
        commandList.forEach((cmd) => {
            if (cmd.actionExists(interaction.customId)) {
                cmd.onActionPress(interaction, interaction.customId);
                return;
            }
        });
        return;
    }
    if (interaction.type == InteractionType.ModalSubmit) {
        commandList.forEach((cmd) => { // событие при отправке текста боту
            if (cmd.actionExists(interaction.customId)) {
                cmd.onActionPress(interaction, interaction.customId);
                return;
            }
        });
        return;
    }
    if (interaction.type === InteractionType.MessageComponent) {
        commandList.forEach((cmd) => {
            if (cmd.actionExists(interaction.customId)) {
                cmd.onActionPress(interaction, interaction.customId);
                return;
            }
        });
        return;
    }
})

client.once('ready', async () => {
    console.log('Bot is loading...');

    const rest = new REST({ version: '10' }).setToken(botToken);

    // Загрузка команд
    await (async () => {
        try {
            console.log('Started refreshing application slash commands.');

            const guilds = client.guilds.cache.map(guild => guild.id);
            guilds.forEach(async (gd) => {
                console.log("Reloading commands for guild %s", gd);
                await rest.put(Routes.applicationGuildCommands(clientId, gd), {
                    body: commands
                });
            });

            console.log('Successfully reloaded application slash commands.');
        } catch (error) {
            console.error(error);
        }
    })();

    commandList.forEach((cmd) => {
        cmd.onClientReady();
    })

    app.listen(port, () => {
        console.log("API running on port " + port);
    })

    console.log('Bot is loaded successfully!');
});

/**
* **Run command.**
* @param {discord.Interaction} interaction Interaction.
*/

const executeCommand = (interaction) => {
    commandList.forEach((cmd) => {
        if (cmd.commandName == interaction.commandName) {
            cmd.run(interaction);
        }
    });
};

client.on('interactionCreate', async (interaction) => {
    if (!interaction.isCommand()) return;

    executeCommand(interaction);
});

client.login(botToken);

module.exports = {
    client: client
}
