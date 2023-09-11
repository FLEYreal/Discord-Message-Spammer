export type ClassicInteractionType = 'mailing' | 'sendToRole' | 'sendToChannel';
export type AdditionalInteractionType = keyof AdditionalLocalizations

export const getLocalization = (interactionType: ClassicInteractionType | AdditionalInteractionType, actualLocale: string) => { // gets localization for certain function
    const locale = actualLocale === 'ru' ? actualLocale : 'en';
    return localizations[interactionType as keyof typeof localizations][locale];
};

type ClassicLocalizations = {
    [key in ClassicInteractionType]: {
        en: Localization,
        ru: Localization
    }
};

type AdditionalLocalizations = {
    alreadyActivatedCommand: {
        en: string,
        ru: string
    }
}

const localizations = {
    mailing: {
        en: {
            title: 'Send message you want to get by every user in server',
            alreadyStartedTitle: '**You already started mailing process!**\nClick on `Cancel mailing` button in previous message to cancel process.',
            buttonLabel: 'Cancel mailing',
            buttonReply: 'Mailing has been canceled'
        },
        ru: {
            title: 'Отправьте сообщение, которое должен получить каждый юзер сервера',
            alreadyStartedTitle: '**Вы уже начали процесс рассылки!**\nНажмите на кнопку `Отменить рассылку` в предыдущем сообщении для отмены.',
            buttonLabel: 'Отменить рассылку',
            buttonReply: 'Рассылка отменена'
        }
    },
    sendToRole: {
        en: {
            title: 'Send message you want to get by every user with role you mentioned',
            alreadyStartedTitle: '**You already started role mailing process!**\nClick on `Cancel role mailing` button in previous message to cancel process',
            buttonLabel: 'Cancel role mailing',
            buttonReply: 'Role mailing has been canceled'
        },
        ru: {
            title: 'Отправьте сообщение, которое должен получить каждый юзер с отмеченной вами ролью',
            alreadyStartedTitle: '**Вы уже начали процесс рассылки ролям!**\nНажмите на кнопку `Отменить рассылку ролям` в предыдущем сообщении для отмены',
            buttonLabel: 'Отменить рассылку ролям',
            buttonReply: 'Рассылка ролям отменена'
        }
    },
    sendToChannel: {
        en: {
            title: 'Send message you want to get by every user in this message channel',
            alreadyStartedTitle: '**You already started channel mailing process!**\nClick on `Cancel channel mailing` button in previous message to cancel process',
            buttonLabel: 'Cancel channel mailing',
            buttonReply: 'Channel mailing has been canceled'
        },
        ru: {
            title: 'Отправьте сообщение, которое должен получить каждый юзер в этом текстовом канале',
            alreadyStartedTitle: '**Вы уже начали процесс рассылки всем юзерам в текстовом канале!**\nНажмите на кнопку `Отменить рассылку в текстовом канале` в предыдущем сообщении для отмены',
            buttonLabel: 'Отменить рассылку в текстовом канале',
            buttonReply: 'Рассылка в текстовом канале отменена'
        }
    },
    alreadyActivatedCommand: {
        en: `You've already activated one of the commands`,
        ru: 'Вы уже активировали одну из команд'
    }
} as ClassicLocalizations | AdditionalLocalizations;

type Localization = {
    title: string,
    alreadyStartedTitle: string,
    buttonLabel: string,
    buttonReply: string
}
