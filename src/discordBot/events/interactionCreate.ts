import {Event} from "./index";
import {alreadyActivatedCommand, commandsToExecute} from "../commands";
import {Interaction} from "discord.js";
import buttonsToExecute from "../buttons";
import {checkActivatedCommand} from "../urils";

const interactionCreate: Event<Interaction> = async i => {
    if (i.isChatInputCommand()) {

        if (checkActivatedCommand(i.user.id)) { // denies interaction if user have already activated one. interaction means slash command
            await alreadyActivatedCommand(i);
            return;
        }

        const cmd = i.commandName;
        await commandsToExecute.find(x => x.builder.name === cmd)?.exec(i);
        return;
    }

    if (i.isButton()) {
        const btn = i.customId;
        await buttonsToExecute[btn as keyof typeof buttonsToExecute](i);
    }
};

export default interactionCreate;
