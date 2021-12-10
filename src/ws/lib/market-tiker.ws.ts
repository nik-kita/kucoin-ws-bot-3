/* eslint-disable max-classes-per-file */
import { v4 } from 'uuid';
import { MarketTickerAllPubDto, MarketTickerSelectPubDto } from '../dto/market-ticker.dto';
import { AfterConnectCb, BaseWs } from './base.ws';

export class MarketTikerAllWs extends BaseWs {
    public static settingBehaviour(cb: AfterConnectCb) {
        return new MarketTikerAllWs(cb);
    }

    protected constructor(
      protected afterConnect: AfterConnectCb,
    ) {
        super(
            new MarketTickerAllPubDto(v4()),
            afterConnect,
        );
    }
}

export class MarketTikerSelectWs extends BaseWs {
    public constructor(
        private coins: string[],
        protected afterConnect: AfterConnectCb,
    ) {
        super(
            new MarketTickerSelectPubDto(
                v4(),
                coins,
            ),
            afterConnect,
        );
    }
}
