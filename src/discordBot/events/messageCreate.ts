import {Event} from "./index";
import {Message, PermissionsBitField} from "discord.js";
import InternalMemoryProcessor from "../internalMemoryProcessor";
import {usedMailing} from "../commands/mailing";
import {usedSendToRole} from "../commands/sendToRole";
import {usedSendToChannel} from "../commands/sendToChannel";
import {mail, toChannel, toRole} from "../botFunctions";

const messageCreate: Event<Message> = async m => {
    const userId = m.author.id;

    const {
        get: getUsedMailing,
        remove: removeUsedMailing
    } = InternalMemoryProcessor(usedMailing);
    const mailingInteraction = getUsedMailing(userId);
    if (mailingInteraction) {
        const useInternalList = mailingInteraction.options.getBoolean('useInternalList');

        await mail(m.guild!, m.content, m.attachments.map(x => x.url), !!useInternalList);

        removeUsedMailing(userId);

        await m.delete();
        await mailingInteraction.deleteReply();

        return;
    }

    const {
        get: getSendToRole,
        remove: removeUsedSendToRole
    } = InternalMemoryProcessor(usedSendToRole);
    const sendToRoleInteraction = getSendToRole(userId);
    if (sendToRoleInteraction) {
        const roleId = sendToRoleInteraction.options.getRole('role')!.id;

        await toRole(m.guild!, m.content, m.attachments.map(x => x.url), roleId);

        removeUsedSendToRole(userId);

        await m.delete();
        await sendToRoleInteraction.deleteReply();

        return;
    }

    const {
        get: getSendToChannel,
        remove: removeUsedSendToChannel
    } = InternalMemoryProcessor(usedSendToChannel);
    const sendToChannelInteraction = getSendToChannel(userId);
    if (sendToChannelInteraction) {
        const members = (await m.guild!.members.fetch()).filter(x => !x.user.bot && x.permissionsIn(m.channel.id).has(PermissionsBitField.Flags.ViewChannel));

        await toChannel(m.guild!, m.content, m.attachments.map(x => x.url), members);

        removeUsedSendToChannel(userId);

        await m.delete();
        await sendToChannelInteraction.deleteReply();
    }
};

export default messageCreate;
