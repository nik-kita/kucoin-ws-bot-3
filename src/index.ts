import { getFirstBotArtifacts } from './actions/first-bot.action';
import { getBot2WithWaitingForPurchase } from './actions/second-bot.action';
import { KucoinWs } from './ws/kucoinws';
import { pause } from './ws/lib/utils/pause.util';

(async () => {
    const { onMessage: firstOnMessage, rmInterval } = getFirstBotArtifacts();
    const { onMessage, waitForPurchase } = getBot2WithWaitingForPurchase();

    const ku = await KucoinWs.open();

    await ku.subscribe();

    const offPurchaseSubscription = ku.addAction(onMessage);
    const offFirstBotAction = ku.addAction(firstOnMessage);

    await waitForPurchase;
    ku.removeAction(offPurchaseSubscription);
    console.log('================================');
    await pause(2000);
    ku.removeAction(offFirstBotAction);
    rmInterval();
    await ku.unsubscribe();
    await ku.close();

    process.exit(0);
})();
