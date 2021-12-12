/* eslint-disable max-classes-per-file */
type BaseOrderParams = {
    side: 'buy' | 'sell',

    symbol: string,
};

type BaseMarketOrderParams = BaseOrderParams & {
    type: 'market',
};

export type LimitOrderParamsDto = BaseOrderParams & {
    size: string,

    price: string,

    type: 'limit',
};

export type MarketSizeOrderParamsDto = BaseMarketOrderParams & {
    size: string,
};

export type MarketFundsOrderParamsDto = BaseMarketOrderParams & {
    funds: string,
};

export type _MarketOrderParamsDto = BaseOrderParams & {
    sizeFundsProp: 'size' | 'funds',
    sizeFundsFloat: string,
    type: 'market',
}

export type OrderParamsDto = _MarketOrderParamsDto | LimitOrderParamsDto;
