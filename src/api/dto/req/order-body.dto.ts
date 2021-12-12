/* eslint-disable max-classes-per-file */
type BaseOrderBody = {
    clientOid: string,

    side: 'buy' | 'sell',

    symbol: string,
};

type BaseMarketOrderBody = BaseOrderBody & {
    type: 'market',
};

export type LimitOrderBodyDto = BaseOrderBody & {
    size: string,

    price: string,

    type: 'limit',
};

export type MarketSizeOrderBodyDto = BaseMarketOrderBody & {
    size: string,
};

export type MarketFundsOrderBodyDto = BaseMarketOrderBody & {
    funds: string,
};

export type _MarketOrderBodyDto = BaseOrderBody & {
    sizeFundsProp: 'size' | 'funds',
    sizeFundsFloat: string,
    type: 'market',
}

export type OrderBodyDto = _MarketOrderBodyDto | LimitOrderBodyDto;
