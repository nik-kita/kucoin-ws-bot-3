import { KucoinWs } from './ws/kucoin.ws';

(async () => {
    const ku = await KucoinWs['/market/ticker:']
        .SELECT
        .selectCoins(['BTC-USDT', 'PAXG-USDT'])
        .settingBehaviour()
        .connect();
    console.log('connected');
    await ku.disconnect();
    console.log('disconnected');
})();
