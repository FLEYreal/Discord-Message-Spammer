import {BotInternalMemory} from "../internalMemoryProcessor";
import {classicInteraction} from "../classic/classicProcessors";

export const usedSendToChannel: BotInternalMemory = {x: []};

const sendToChannel = classicInteraction('sendToChannel', usedSendToChannel);

export default sendToChannel;
