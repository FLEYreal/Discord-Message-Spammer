import {Client, GatewayIntentBits} from "discord.js";
import registerCommands from "./commands";
import registerEvents from "./events";

const initialize = async (token: string) => {
    const client = new Client({
        intents: [
            GatewayIntentBits.Guilds,
            GatewayIntentBits.DirectMessages,
            GatewayIntentBits.MessageContent,
            GatewayIntentBits.GuildMessages,
            GatewayIntentBits.GuildMembers,
        ]
    });

    registerEvents(client);

    await client.login(token);

    registerCommands(client);

    return client;
};

export default {initialize};
