/* eslint-disable max-classes-per-file */
import { v4 } from 'uuid';
import { MarketTickerAllPubDto, MarketTickerSelectPubDto } from '../dto/pub/market-ticker.pub.dto';
import { AfterConnectCb, CONSOLE_LOG_CB } from './after-connect-cb';
import { BaseWs } from './base.ws';

export class MarketTikerAllWs extends BaseWs {
    public static settingBehaviour(cb: AfterConnectCb = CONSOLE_LOG_CB) {
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
        protected afterConnect: AfterConnectCb = CONSOLE_LOG_CB,
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
