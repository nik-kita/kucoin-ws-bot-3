import { BaseMessageDto } from './dto/utility-messages.dto';

export type OnMessageCb = (message: BaseMessageDto) => void;

class DefaultOnMessageCbs {
    public static CONSOLE_LOG_CB: OnMessageCb = (message) => {
        // eslint-disable-next-line no-console
        console.log(message);
    };

    public static NOTHING_CB: OnMessageCb = () => {};
}

export const {
    CONSOLE_LOG_CB,
    NOTHING_CB,
} = DefaultOnMessageCbs;
