import {BotInternalMemory} from "../internalMemoryProcessor";
import {classicInteraction} from "../classic/classicProcessors";

export const usedMailing: BotInternalMemory = {x: []};

const mailing = classicInteraction('mailing', usedMailing);

export default mailing;
