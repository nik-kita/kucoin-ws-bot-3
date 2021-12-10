/* eslint-disable max-classes-per-file */
import { IGeneralPublish } from '../../lib/dto/ws-pub.dto';

export const WS_MARKET_TICKER_ALL = '/market/ticker:all' as const;
export const WS_MARKET_TICKER_SELECT = '/market/ticker:' as const;

export class MarketTickerAllPubDto implements IGeneralPublish {
    constructor(public id: string) { }

    type = 'subscribe' as const;

    topic = WS_MARKET_TICKER_ALL;

    response = true as const;
}

export class MarketTickerSelectPubDto implements IGeneralPublish {
    constructor(
        public id: string,
        public coins: string[],
    ) { }

    type = 'subscribe' as const;

    topic = `${WS_MARKET_TICKER_SELECT}${this.coins.join(',')}`;

    response = true as const;
}
