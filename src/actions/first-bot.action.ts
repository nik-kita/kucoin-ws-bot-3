/* eslint-disable no-param-reassign */
import { MarketTickerMessageDto, TData } from '../ws/dto/sub/market-ticker.sub.dto';

const coins = new Map<string, MarketTickerMessageDto>();
const leaders = new Map<number, MarketTickerMessageDto>();
const leaderNames: string[] = [];

class FirstBotAction {
    public static firstBotAction(message: MarketTickerMessageDto) {
        if (!message.subject.includes('USDT')) return;

        const { data, subject } = message;
        const _message = coins.get(subject);

        if (!_message) {
            const _data: TData = {
                ...data, agio: 0, startPrice: data.price, lastPrice: data.price,
            };
            message.data = _data;
            coins.set(subject, message);
        } else {
            const { price } = data;
            const { data: _data } = _message;

            _data.lastPrice = price;
            _data.agio = 100 - (parseFloat(_data.startPrice) * 100) / parseFloat(price);
        }

        const _leaders = Array.from(coins.values()).sort((a: MarketTickerMessageDto, b: MarketTickerMessageDto) => a.data.agio! - b.data.agio!).slice(-3);

        _leaders.forEach((l, i, a) => {
            if (!leaderNames.includes(l.subject)) {
                const index = a.length - i;
                leaders.set(index, l);
                leaderNames[index] = l.subject;

                Array.from(leaders.values()).forEach((v) => console.log(`${v.subject}: ${v.data.agio}%    ${v.data.lastPrice}`));
                console.log();
            }
        });
    }
}

export const {
    firstBotAction,
} = FirstBotAction;
