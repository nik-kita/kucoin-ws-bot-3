/* eslint-disable max-classes-per-file */
import { IGeneralPublish } from '../../lib/dto/ws-pub.dto';

export const WS_MARKET_TICKER_SELECT = '/market/ticker:' as const;
export class MarketTickerPubDto implements IGeneralPublish {
    constructor(
        public id: string,
        public type: 'subscribe' | 'unsubscribe' = 'subscribe',
        public coins?: string[],
    ) { }

    topic = `${WS_MARKET_TICKER_SELECT}${this.coins ? this.coins.join(',') : 'all'}`;

    response = true as const;
}
