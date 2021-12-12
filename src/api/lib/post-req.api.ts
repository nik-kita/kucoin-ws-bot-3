import { TBulletPrivateRes } from '../dto/res/bullet-private.dto';
import { BaseMethod } from './base-method.api';
import { POST } from './constants.api';

const { API_V1_BULLET_PRIVATE } = POST;
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

    public static [API_V1_BULLET_PRIVATE] = new PostReq(API_V1_BULLET_PRIVATE) as Omit<
      PostReq<TBulletPrivateRes>, 'setParams'
  >;
}
