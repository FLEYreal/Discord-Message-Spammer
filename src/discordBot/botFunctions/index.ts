import {Attachment, AttachmentBuilder, Collection, Guild, GuildMember} from "discord.js";
import * as fs from "fs";

type Attachments = Attachment[] | AttachmentBuilder[] | string[];
export const mail = async (guild: Guild, content: string, attachments: Attachments, useInternalList: boolean) => { // mail function
    const userIdArray: string[] = useInternalList ? JSON.parse(fs.readFileSync('./usersForMailing.json', 'utf8')) : [];
    (await guild.members.fetch()).each(member => {

        if (member.user.bot) return;

        if (userIdArray.length > 0 && !userIdArray.includes(member.id)) return;

        member.user.send({
            content: content,
            files: attachments
        });
    });
};

export const toRole = async (guild: Guild, content: string, attachments: Attachments, roleId: string) => { // send to role function
    (await guild.roles.fetch()).find(x => x.id === roleId)?.members.each(member => {
        if (member.user.bot) return;
        member.user.send({
            content: content,
            files: attachments
        });
    });
};

export const toChannel = async (guild: Guild, content: string, attachments: Attachments, members: Collection<string, GuildMember>) => { // send to channel function
    members.each(x => x.send({
        content: content,
        files: attachments
    }));
};
