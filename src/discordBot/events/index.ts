import {Client, Events} from "discord.js";
import interactionCreate from "./interactionCreate";
import messageCreate from "./messageCreate";

export type Event<T> = (x: T) => Promise<void>;

const registerEvents = (client: Client) => {
    client.on(Events.InteractionCreate, interactionCreate);
    client.on(Events.MessageCreate, messageCreate);
};

export default registerEvents;
