import { firstBotAction } from './actions/first-bot.action';
import { KucoinWs } from './ws/kucoinws';

(async () => {
    const ku = await KucoinWs.open();
    await ku.subscribe();
    ku.addAction(firstBotAction);
})();
