import { KucoinWs } from './ws/kucoinws';
import { pause } from './ws/lib/utils/pause.util';

(async () => {
    const ku = await KucoinWs.open();

    ku.addAction(console.log);
    await ku.subscribe();
    await pause(2000);
    await ku.unsubscribe();
    await pause(5000);
    await ku.subscribe(['ETH-USDT']);
    await pause(2000);
    await ku.close();
})();
