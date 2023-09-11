import {Command} from "../commands";
import {ActionRowBuilder, ButtonBuilder, ButtonInteraction, ButtonStyle} from "discord.js";
import {Event} from "../events";
import InternalMemoryProcessor, {BotInternalMemory} from "../internalMemoryProcessor";
import {getLocalization, ClassicInteractionType} from "./classicLocalizations";

export const classicInteraction = (interactionType: ClassicInteractionType, storage: BotInternalMemory): Command => { // prepares a classic interaction event for interactionCreate
    const {
        add,
        get
    } = InternalMemoryProcessor(storage);

    return async i => {
        const {title, alreadyStartedTitle, buttonLabel} = getLocalization(interactionType, i.locale);

        const userId = i.user.id;

        if (get(userId)) {
            await i.reply({
                "content": alreadyStartedTitle,
                "ephemeral": true,
            });

            return;
        }

        add(i);

        const cancelButton = new ActionRowBuilder<ButtonBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setCustomId(interactionType)
                    .setStyle(ButtonStyle.Danger)
                    .setLabel(buttonLabel),
            );

        await i.reply({
            "embeds": [
                {
                    "title": title,
                    "color": 0x39AECF
                }
            ],
            "ephemeral": true,
            "components": [cancelButton]
        });
    };
};

export const classicCancelButton = (interactionType: ClassicInteractionType, storage: BotInternalMemory): Event<ButtonInteraction> => { // prepares a cancel button for interactionCreate
    const {remove} = InternalMemoryProcessor(storage);

    return async i => {
        const {buttonReply} = getLocalization(interactionType, i.locale);

        remove(i.user.id);
        await i.reply({
            "content": buttonReply,
            ephemeral: true
        });
    };
};
