import mailing from "./mailing";
import {ChatInputCommandInteraction, Client, SlashCommandBuilder,} from "discord.js";
import sendToRole from "./sendToRole";
import sendToChannel from "./sendToChannel";
import {getLocalization} from "../classic/classicLocalizations";

export type Command = (i: ChatInputCommandInteraction) => Promise<void>;

type CommandsToExecute = {
    builder: SlashCommandBuilder,
    exec: Command
};

export const commandsToExecute = [ // setting up slash commands
    {
        builder: new SlashCommandBuilder().setName('mailing').setDescription('Mailing command')
            .setNameLocalization('ru', 'рассылка').setDescriptionLocalization('ru', 'Команда для рассылки'),
        exec: mailing
    },
    {
        builder: new SlashCommandBuilder().setName('sendtorole').setDescription('Sending message to users with that role')
            .setNameLocalization('ru', 'отправитьроли').setDescriptionLocalization('ru', 'Отправить сообщение юзерам с выбранной ролью')
            .addRoleOption(x=>
                x.setName('role').setNameLocalization('ru', 'роль')
                    .setDescription('Role to send a message').setDescriptionLocalization('ru', 'Роль, которой нужно отправить сообщение')
                    .setRequired(true)
            ),
        exec: sendToRole
    },
    {
        builder: new SlashCommandBuilder().setName('sendtochannel').setDescription('Sending message to all users in that message channel')
            .setNameLocalization('ru', 'отправитьканалу').setDescriptionLocalization('ru', 'Отправить сообщение всем юзерам в этом текстовом канале'),
        exec: sendToChannel
    }
] as CommandsToExecute[];

export const alreadyActivatedCommand: Command = async i => {
    const reply = getLocalization("alreadyActivatedCommand", i.locale);
    await i.reply({
        content: reply,
        ephemeral: true
    });
};

const registerCommands = (client: Client) => client.guilds.cache.each(g => g.commands.set(commandsToExecute.map(x=>x.builder)));

export default registerCommands;
