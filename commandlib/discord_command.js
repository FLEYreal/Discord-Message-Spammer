// class for basic discord slash command

const fs = require("fs");
var discord = require("discord.js");

class DiscordCommand {
    // variables
    commandName = "";
    commandDescription = "";
    rawData = {};
    /**
     * @type {string[]}
     */
    #actionCallbacks = [];

    client;

    // constructor
    constructor(cmdName, cmdDescription) {
        this.commandName = cmdName;
        this.commandDescription = cmdDescription;
    }

    /**
    * **Run command**
    * @param {discord.Interaction} interaction Interaction;
    */
    async run(interaction) {
        console.log(`Running command ${this.commandName}.`);
        
        // check if variables are undefined.
        if (interaction == undefined) {
            throw new Error(`"interaction" is undefined!`);
        }

        // this.cleanup();
    }

    /**
     * Action callback
     * @param {discord.Interaction} interaction Interaction;
     * @param {string} actionid Action ID
     */
    async onActionPress(interaction, actionid) {}

    /**
     * Register action callback 
     * @param {string} actionid Action ID
     */
    _registerAction(actionid) {
        this.#actionCallbacks.push(actionid);
    }

    /**
     * Check if action is registered
     * @param {string} actionid
     * @return {boolean}
     */
    actionExists(actionid) {
        return this.#actionCallbacks.includes(actionid);
    }

    generateCommand() {
        return this.rawData;
    }

    onClientReady() {}
}

const createCommandExtended = (commandName = "", commandPath = "") => {
    // get command list file
    const commandListFile = fs.readFileSync("commandlib/commands.json").toString("utf8");
    
    // parse it
    var commandList = JSON.parse(commandListFile);

    // create command
    var commandinherit = null;

    commandList.forEach(cmd => {
        if (cmd.name == commandName) {
            // we found required command!
            const name = cmd.name;
            const desc = cmd.description;

            var DCommand = require(commandPath);

            commandinherit = new DCommand(name, desc);
            
            commandinherit.rawData = cmd;
        }
    });
    return commandinherit;
} 

const createCommand = (commandName = "", type = "command") => {
    return createCommandExtended(commandName, `../commands/${type}_${commandName}.js`);
} 

module.exports = {
    DiscordCommand: DiscordCommand,
    DCC: DiscordCommand,

    createCommand: createCommand,
    createCommandExtended: createCommandExtended
}