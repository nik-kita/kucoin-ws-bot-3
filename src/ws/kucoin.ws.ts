import { WS_MARKET_TICKER_SELECT } from './dto/pub/market-ticker.pub.dto';
import { AfterConnectCb, CONSOLE_LOG_CB } from './lib/after-connect-cb';
import { MarketTikerAllWs, MarketTikerSelectWs } from './lib/market-tiker.ws';

export class KucoinWs {
    public static [WS_MARKET_TICKER_SELECT] = {
        ALL: MarketTikerAllWs,
        SELECT: {
            selectCoins(coins: string[]) {
                return {
                    settingBehaviour(cb: AfterConnectCb = CONSOLE_LOG_CB) {
                        return new MarketTikerSelectWs(coins, cb);
                    },
                };
            },
        },
    };
}
