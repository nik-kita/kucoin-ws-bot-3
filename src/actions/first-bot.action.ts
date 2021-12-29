/* eslint-disable no-param-reassign */
import { MarketTickerMessageDto, TData } from '../ws/dto/sub/market-ticker.sub.dto';

const coins = new Map<string, MarketTickerMessageDto>();
const leaders = new Map<number, MarketTickerMessageDto>();
const leaderNames: string[] = [];
const LOG_INTERVAL = 1500;
const LEADER_AMOUNT = 3;
let isFirstTime = true;
class FirstBotAction {
    private static rmInterval: any;

    private static firstBotAction(message: MarketTickerMessageDto) {
        if (!message.subject.includes('USDT')
        || [
            '3S', '3L', '5S', '5L',
        ].some((bad) => message.subject.split('-')[0].includes(bad))) return;

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

        const _leaders = Array.from(coins.values()).sort((a: MarketTickerMessageDto, b: MarketTickerMessageDto) => a.data.agio! - b.data.agio!).slice(-LEADER_AMOUNT);

        _leaders.forEach((l, i, a) => {
            if (!leaderNames.includes(l.subject)) {
                const index = a.length - i;
                leaders.set(index, l);
                leaderNames[index] = l.subject;
            }

            if (isFirstTime) {
                isFirstTime = false;
                FirstBotAction.rmInterval = setInterval(() => {
                    Array.from(leaders.values()).forEach((v) => console.log(`${v.subject}: ${v.data.agio}%    ${v.data.lastPrice}`));
                    console.log();
                }, LOG_INTERVAL);
            }
        });
    }

    public static getFirstBotArtifacts() {
        return {
            onMessage: FirstBotAction.firstBotAction,
            rmInterval: () => clearInterval(FirstBotAction.rmInterval),
        };
    }
}

export const {
    getFirstBotArtifacts,
} = FirstBotAction;
