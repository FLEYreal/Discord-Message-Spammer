import {usedMailing} from "./commands/mailing";
import {usedSendToChannel} from "./commands/sendToChannel";
import {usedSendToRole} from "./commands/sendToRole";
import {ImpEqualPredicate} from "./internalMemoryProcessor";

export const checkActivatedCommand = (id: string) =>
    !!usedMailing.x.find(ImpEqualPredicate(id)) || !!usedSendToChannel.x.find(ImpEqualPredicate(id)) || !!usedSendToRole.x.find(ImpEqualPredicate(id));
