import {
    MarketSizeOrderBodyDto, LimitOrderBodyDto, MarketFundsOrderBodyDto, OrderBodyDto, _MarketOrderBodyDto,
} from '../dto/req/order-body.dto';
import { TBulletPrivateRes } from '../dto/res/bullet-private.dto';
import { TOrderRes } from '../dto/res/order.dto';
import { BaseMethod } from './base-method.api';
import { POST } from './constants.api';

const { API_V1_BULLET_PRIVATE, API_V1_ORDERS } = POST;
export class PostReq<TRes, TParams = any, TBody = any> extends BaseMethod<TRes, TParams, TBody> {
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

    public static [API_V1_ORDERS] = (() => {
        const postReq = new PostReq<TOrderRes, any, OrderBodyDto>(API_V1_ORDERS);
        postReq.bodyResolver = (body: LimitOrderBodyDto | _MarketOrderBodyDto) => {
            let _body: LimitOrderBodyDto | MarketFundsOrderBodyDto | MarketSizeOrderBodyDto;

            if ((body as LimitOrderBodyDto).price) {
                _body = body as LimitOrderBodyDto;
            } else if ((body as _MarketOrderBodyDto).sizeFundsProp === 'funds') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { sizeFundsProp, sizeFundsFloat: funds, ...generalParams } = body as _MarketOrderBodyDto;
                _body = { funds, ...generalParams } as MarketFundsOrderBodyDto;
            } else if ((body as _MarketOrderBodyDto).sizeFundsProp === 'size') {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { sizeFundsProp, sizeFundsFloat: size, ...generalParams } = body as _MarketOrderBodyDto;
                _body = { size, ...generalParams } as MarketSizeOrderBodyDto;
            } else {
                throw new Error(`Incorrect params for ${API_V1_ORDERS}`);
            }

            return _body;
        };

        return postReq as Omit<PostReq<TOrderRes, any, OrderBodyDto>, 'exec' | 'setParams'>;
    })();

    public static [API_V1_BULLET_PRIVATE] = new PostReq(API_V1_BULLET_PRIVATE) as Omit<
      PostReq<TBulletPrivateRes>, 'setParams' | 'setBody'
  >;
}
