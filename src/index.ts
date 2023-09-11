import express from "express";
import fileUpload, {UploadedFile} from "express-fileupload";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import * as process from "process";
import discordBot from "./discordBot";
import {AttachmentBuilder, PermissionsBitField} from "discord.js";
import {celebrate, Joi, Segments} from "celebrate";
import {mail, toChannel, toRole} from "./discordBot/botFunctions";

dotenv.config({path: '.env.dev'});

const app = express();
const token = process.env.TOKEN!;
const port = process.env.PORT;
const isApiKeyOn = process.env.API_KEY_CHECK;
const apiKey = process.env.API_KEY;

app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(fileUpload());
app.use(cookieParser());

type FuncType = 'mail' | 'toRole' | 'toChannel';

type SendBody = {
    funcType: FuncType,
    guildId: string,
    channelId?: string,
    roleId?: string,
    useInternalList?: boolean,
    message: string
}

(async () => {
    const client = await discordBot.initialize(token);

    app.post('/send', celebrate({ // an endpoint that waits for body with type SendBody and a file
        [Segments.BODY]: Joi.object().keys({
            funcType: Joi.string<FuncType>().required(),
            guildId: Joi.string().required(),
            channelId: Joi.string(),
            roleId: Joi.string(),
            useInternalList: Joi.boolean(),
            message: Joi.string().required()
        })
    }), async (req, res) => {
        if (isApiKeyOn && req.cookies.API_KEY !== apiKey) { // simplest way to protect the endpoint. you're able to switch API_KEY_CHECK and change API_KEY in .env
            res.send('wrong api key');
            return;
        }

        const {
            funcType,
            guildId,
            channelId,
            roleId,
            useInternalList,
            message
        } = req.body as SendBody;

        let files: AttachmentBuilder[] = [];

        if (req.files) {
            const attachmentBuilder = new AttachmentBuilder((Object.values(req.files)[0] as UploadedFile).data);
            files = [attachmentBuilder];
        }

        const guild = await client.guilds.fetch(guildId);

        let members;
        if (channelId) members = (await guild.members.fetch()).filter(x => !x.user.bot && x.permissionsIn(channelId).has(PermissionsBitField.Flags.ViewChannel));

        switch (funcType) {
            case "mail":
                await mail(guild, message, files, !!useInternalList);
                break;
            case "toRole":
                await toRole(guild, message, files, roleId!);
                break;
            case "toChannel":
                await toChannel(guild, message, files, members!);
        }

        res.send('message sent');
    });

    app.listen(port, () => console.log("API running on port " + port));
})();


