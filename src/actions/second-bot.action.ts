/* eslint-disable no-param-reassign */
import { v4 } from 'uuid';
import { Req } from '../api/req.api';
import { MarketTickerMessageDto, TData } from '../ws/dto/sub/market-ticker.sub.dto';
import { Promitter } from '../ws/lib/utils/promitter.util';

const MIN_AGIO_FOR_BUY = 1;
const AMOUNT_TO_BUY_USDT = 5;
let IS_PURCHASED = false;

class SecondBotActions {
    private static promitter = new Promitter();

    private static coins = new Map<string, MarketTickerMessageDto>();

    private static waitForPurchase = SecondBotActions.promitter.waitFor('purchase');

    private static onMessage(message: MarketTickerMessageDto) {
        if (!message.subject.includes('USDT')
          || [
              '3S', '3L', '5S', '5L',
          ].some((bad) => message.subject.split('-')[0].includes(bad))
          || IS_PURCHASED) return;

        const { data, subject } = message;
        let _message = SecondBotActions.coins.get(subject);

        if (!_message) {
            _message = message;
            const _data: TData = {
                ...data, agio: 0, startPrice: data.price, lastPrice: data.price,
            };
            _message.data = _data;
            SecondBotActions.coins.set(subject, message);
        } else {
            const { price } = data;
            const { data: _data } = _message;

            _data.lastPrice = price;
            _data.agio = 100 - (parseFloat(_data.startPrice) * 100) / parseFloat(price);
        }

        if (_message.data.agio! > MIN_AGIO_FOR_BUY) {
            IS_PURCHASED = true;

            const { price } = _message.data;
            const fixed = price.split('.')[1].length;
            const priceToBuy = (parseFloat(_message.data.lastPrice) * 1.1).toFixed(fixed);
            const size = Math.floor(AMOUNT_TO_BUY_USDT / parseFloat(priceToBuy)).toString();
            const purchaseBody = {
                symbol: subject,
                side: 'buy' as const,
                type: 'limit' as const,
                clientOid: v4(),
                price: priceToBuy,
                size,
            };

            console.log(purchaseBody);
            console.log('priceToBuy', priceToBuy);
            console.log('originalPrice', price);

            Req.POST['/api/v1/orders'].setBody(purchaseBody).exec().then((res) => {
                console.log('PURCHASING!');
                console.log(res);
                console.log('---------------------');
                SecondBotActions.promitter.emit('purchase', res);
            }).catch((err) => {
                SecondBotActions.promitter.emitReject('purchase', err);
            });
        }
    }

    public static getBotWithWaitingForPurchase() {
        return {
            onMessage: SecondBotActions.onMessage,
            waitForPurchase: SecondBotActions.waitForPurchase,
        };
    }
}

export const {
    getBotWithWaitingForPurchase: getBot2WithWaitingForPurchase,
} = SecondBotActions;
