import { KucoinWs } from './ws/kucoinws';

(async () => {
    const ku = await KucoinWs.open();

    console.log('connected');
    await ku.close();
    console.log('disconnected');
})();
