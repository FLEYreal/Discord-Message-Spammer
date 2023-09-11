import {ChatInputCommandInteraction} from "discord.js";

export type BotInternalMemory = { x: ChatInputCommandInteraction[] };

export const ImpEqualPredicate = (id: string) => (x: ChatInputCommandInteraction) => x.user.id === id;

const InternalMemoryProcessor = (object: BotInternalMemory) => { // processor for managing internal memory containing user interactions that used the command
    const add = (i: ChatInputCommandInteraction) => object.x.push(i);
    const get = (id: string) => object.x.find(ImpEqualPredicate(id));
    const remove = (id: string) => object.x = object.x.filter(x => x.user.id !== id);

    return {
        add,
        get,
        remove
    };
};

export default InternalMemoryProcessor;
