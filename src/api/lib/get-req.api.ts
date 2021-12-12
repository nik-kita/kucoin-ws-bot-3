import { AccountInfroParamsDto } from '../dto/req/account-info-params.dto';
import {
    LimitOrderParamsDto, MarketFundsOrderParamsDto, MarketSizeOrderParamsDto, OrderParamsDto, _MarketOrderParamsDto,
} from '../dto/req/order-params.dto';
import { AccountInfoResDto } from '../dto/res/account-info.dto';
import { TOrderRes } from '../dto/res/order.dto';
import { BaseMethod } from './base-method.api';
import { GET } from './constants.api';

const { API_V1_ACCOUNTS, API_V1_ORDERS } = GET;

export class GetReq<TRes, TParams = any> extends BaseMethod<TRes, TParams> {
    private constructor(
        endpoint: string,
        params?: object,
    ) {
        super(
            'GET',
            endpoint,
            params,
        );
    }

    public static [API_V1_ACCOUNTS] = new GetReq(API_V1_ACCOUNTS) as GetReq<AccountInfoResDto, AccountInfroParamsDto>;

    public static [API_V1_ORDERS] = (() => {
        const getReq = new GetReq<TOrderRes, OrderParamsDto>(API_V1_ORDERS);
        getReq.paramsResolver = (params: LimitOrderParamsDto | _MarketOrderParamsDto) => {
            let _params: LimitOrderParamsDto | MarketFundsOrderParamsDto | MarketSizeOrderParamsDto;

            if ((params as LimitOrderParamsDto).price) {
                _params = params as LimitOrderParamsDto;
            } else if ((params as _MarketOrderParamsDto).sizeFundsProp === 'funds') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { sizeFundsProp, sizeFundsFloat: funds, ...generalParams } = params as _MarketOrderParamsDto;
                _params = { funds, ...generalParams } as MarketFundsOrderParamsDto;
            } else if ((params as _MarketOrderParamsDto).sizeFundsProp === 'size') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { sizeFundsProp, sizeFundsFloat: size, ...generalParams } = params as _MarketOrderParamsDto;
                _params = { size, ...generalParams } as MarketSizeOrderParamsDto;
            } else {
                throw new Error(`Incorrect params for ${API_V1_ORDERS}`);
            }

            return _params;
        };

        return getReq as Omit<GetReq<TOrderRes, OrderParamsDto>, 'exec'>;
    })();
}
