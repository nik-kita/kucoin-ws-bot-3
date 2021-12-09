/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */

import axios from 'axios';
import { AccountInfroParamsDto } from './req-dto/account-info-params.dto';
import {
    LimitOrderParamsDto, MarketFundsOrderParamsDto, MarketSizeOrderParamsDto, OrderParamsDto, _MarketOrderParamsDto,
} from './req-dto/order-params.dto';
import { AccountInfoResDto } from './res-dto/account-info.dto';
import { BulletPrivateResType } from './res-dto/bullet-private.dto';
import { OrderResType } from './res-dto/order.dto';
import { SignGenerator } from './sign-generator.api';

/* eslint-disable max-classes-per-file */
const HOST = 'https://api.kucoin.com';
const API_V1_BULLET_PRIVATE = '/api/v1/bullet-private';
const API_V1_ORDERS = '/api/v1/orders';
const API_V1_ACCOUNTS = '/api/v1/accounts';

class BaseMethod<ResType> {
    protected constructor(
        private method: 'GET' | 'POST',
        protected endpoint: string,
        protected params?: object,
        protected body?: object,
    ) { }

    public async exec() {
        const headers = SignGenerator
            .create()
            .generateHeaders(
                {
                    method: this.method,
                    endpoint: this.endpoint,
                    params: this.params,
                    body: this.body,
                },
            );
        const { data: axiosData } = await axios({
            headers,
            method: this.method,
            url: HOST + this.endpoint,
        });
        const { data } = axiosData;

        return data as Promise<ResType | undefined>;
    }
}

class GetReq<ResType, ParamsType = any> extends BaseMethod<ResType> {
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

    private paramsResolver: (params: any) => any = (params: any) => params;

    public static [API_V1_ACCOUNTS] = new GetReq<AccountInfoResDto, AccountInfroParamsDto>(API_V1_ACCOUNTS);

    public static [API_V1_ORDERS] = (() => {
        const getReq = new GetReq<OrderResType, OrderParamsDto>(API_V1_ORDERS);
        getReq.paramsResolver = (params: LimitOrderParamsDto | _MarketOrderParamsDto) => {
            let _params: LimitOrderParamsDto | MarketFundsOrderParamsDto | MarketSizeOrderParamsDto;

            if ((params as LimitOrderParamsDto).price) {
                _params = params as LimitOrderParamsDto;
            } else if ((params as _MarketOrderParamsDto).sizeFundsProp === 'funds') {
                const { sizeFundsProp, sizeFundsFloat: funds, ...generalParams } = params as _MarketOrderParamsDto;
                _params = { funds, ...generalParams } as MarketFundsOrderParamsDto;
            } else if ((params as _MarketOrderParamsDto).sizeFundsProp === 'size') {
                const { sizeFundsProp, sizeFundsFloat: size, ...generalParams } = params as _MarketOrderParamsDto;
                _params = { size, ...generalParams } as MarketSizeOrderParamsDto;
            } else {
                throw new Error(`Incorrect params for ${API_V1_ORDERS}`);
            }

            return _params;
        };

        return getReq as Omit<GetReq<OrderResType, OrderParamsDto>, 'exec'>;
    })();

    public setParams(params: ParamsType) {
        this.params! = this.paramsResolver(params);

        return this;
    }
}

const t = GetReq['/api/v1/orders'].setParams({
    side: 'sell',
    size: 'asdf',
    price: 'asdfsd',
    // sizeFundsProp: 'funds',
    // sizeFundsFloat: 'okj',
    symbol: 'asdfa',
    type: 'limit',
});

class PostReq<ResType, ParamsType = any, BodyType = any> extends BaseMethod<ResType> {
    private constructor(
        endpoint: string,
        params?: object,
        body?: object,
    ) {
        super(
            'POST',
            endpoint,
            params,
            body,
        );
    }

    public static [API_V1_BULLET_PRIVATE] = new PostReq<BulletPrivateResType>(API_V1_BULLET_PRIVATE);
}

class Req {
    public static POST = PostReq;
}

Req.POST['/api/v1/bullet-private'].exec();
