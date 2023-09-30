# Discord-Message-Spammer

### About
1. This bot can send messages to all users of the discord server. Could be used for mailing, supports attachment of images, gifs, files.
2. Has convenient API which lets to send requests for sending messages to users outside of discord. Could be used for letting you to send messages from your website or setup notification system.

### Notation
If you are interested in collaboration, message here:
Telegram: @Nikita1264
Discord: fley0609

## How to Start

Application is made on NodeJS so to use the script, you need to download it from official website [here](https://nodejs.org/en).

1. To Launch the bot, enter the folder of the bot in the console using following command:
```shell
cd C:/path/to/directory
```
3. Inside of the console, after entering the bot's folder, type this command to install all the dependencies:
```shell
npm install
```
4. In the file ".env" (or ".env.production") fill necessery data for the script to work. 
    - All the settings are optional expect "TOKEN". This is the token of your discord bot without which script won't be able to connect to discord using exactly your bot.

5. To launch the bot use:
```shell
npm start
```

6. To Stop the application, you need yo use "ctrl + C" keys.

# A little Documentation
This is a little documentation to basics of using this script. 

## In discord usage

### Mailing to everyone
1. To mail your message type command /mailing (/рассылка).
2. Then you'll see the message (Only you can see it) that tells you to send message you want to mail to everyone.
    2.1 It also contains "Cancel" button so if you don't want to send message anymore - cancel it.

    2.2 The reason it's made this way is because arguments of the application commands don't let send more than 1 file at a time.
3. Message is sent, you're happy!
 
### Mailing to role
Scripts supports sending the messages to users of the specific role.
It's the same process as with Mailing to everyone but the command to do it is "/sendToRole <argument: role id>"

### Mailing to users of the channel
Scripts supports sending the messages to users that have the access to the chat the command was used.
It's the same process as with Mailing to everyone but the command to do it is "/sendToChannel"

## API usage
If you don't know what API is, I really recommend to read about it. The best way to test it out is Postman.
The bot contains just one endpoint which is responsible for sending the messages to users.

<b>Endpoint: /send</b>
<b>Method: POST</b>
<b>Body:</b>
```typescript
interface SendBody = {
    // This property is responsible for the type of mailing, sending to everyone "mail", 
    // sending to specific role "toRole" or to members of the channel "toChannel"
    funcType: 'mail' | 'toRole' | 'toChannel'

    // This property is and ID of the discord server the bot will work. We don't want the bot 
    // to mail to every discord server it's located in at a time, isn't it?
    guildId: string

    // Optional property, this is 'toChannel' specific property, this is an id of the channel.
    channelId?: string

    // Optional property, this is 'toRole' specific property, this is an id of the role.
    roleId?: string

    // Most valuable property - the message to send.
    message: string

    // Optional property, if true - sends messages of users whose ids are in the array in file "usersForMailing.json".
    // You can add your ids to this file and send messages to only those users.
    useInternalList?: false
}
```
### Files:
You can attach any file to your request and it will be sent as an attachment.

## API keys
If you want to restrict your API from being open to everyone you can create and enable your api key.
API key is sort of password to your api endpoints which is known by only you and if you expose it, everyone will be able to use API even with enabled api checking.
You can always change the api key so it might not be that big of a trouble.

You might notice undefined values in ".env" file when you were setting up the bot, so, these values are for this needs.

```env
API_KEY_CHECK=
```
Add any string, number, boolean to this value to enable api checking and leave this empty to disable api checking.

```env
API_KEY=
```
Add the value of api key here.

## Usage of API keys
Now, after we enabled api checking and have api key in our ".env". How do we use it in endpoints? If you just send the request without API key - you will get:
<b>Code: 400</b>
<b>Body:</b>
```json
{
    "success": false,
    "message": "API key is required!"
}
```

You have to put API key in your cookies. It has to be called "API_KEY". If you have wrong API KEY (or someone else?) you will get:
<b>Code: 400</b>
<b>Body:</b>
```json
{
    "success": false,
    "message": "You have sent a wrong API Key!"
}
```

## Important!
This bot is provided solely for informational purposes. I am not responsible for how it is used or the actions that users may take with its help. Please be aware that the bot is made solely for informational purposes! All responsibility for interacting with this bot lies with the user!
