import { KucoinWs } from './ws/kucoin.ws';

(async () => {
    await KucoinWs['/market/ticker:']
        .SELECT
        .selectCoins(['BTC-USDT', 'PAXG-USDT'])
        .settingBehaviour()
        .connect();
})();
