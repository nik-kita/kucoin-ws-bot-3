import { Req } from './api/req.api';

(async () => {
    try {
        const res = await Req.GET['/api/v1/accounts'].setParams({
            type: 'trade',
            currency: 'ETH',
        }).exec();

        console.log(res);
    } catch (reqError: any) {
        console.log('REQERROR:');
        // console.log(reqError);
    }
})();
