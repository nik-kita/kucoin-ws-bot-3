import { WS_MARKET_TICKER_SELECT } from './dto/market-ticker.dto';
import { AfterConnectCb } from './lib/base.ws';
import { MarketTikerAllWs, MarketTikerSelectWs } from './lib/market-tiker.ws';

export class KucoinWs {
    public static [WS_MARKET_TICKER_SELECT] = {
        ALL: MarketTikerAllWs,
        SELECT: {
            selectCoins(coins: string[]) {
                return {
                    settingBehaviour(cb: AfterConnectCb) {
                        return new MarketTikerSelectWs(coins, cb);
                    },
                };
            },
        },
    };
}
