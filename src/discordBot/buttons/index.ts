import {ButtonInteraction} from "discord.js";
import {usedMailing} from "../commands/mailing";
import {usedSendToRole} from "../commands/sendToRole";
import {usedSendToChannel} from "../commands/sendToChannel";
import {ClassicInteractionType} from "../classic/classicLocalizations";
import {classicCancelButton} from "../classic/classicProcessors";

type Button = (i: ButtonInteraction) => Promise<void>;

type ButtonsToExecute = {
    [key in ClassicInteractionType]: Button;
}

const buttonsToExecute = { // setting up buttons
    'mailing': classicCancelButton('mailing', usedMailing),
    'sendToRole': classicCancelButton('sendToRole', usedSendToRole),
    'sendToChannel': classicCancelButton('sendToChannel', usedSendToChannel),
} as ButtonsToExecute;

export default buttonsToExecute;
