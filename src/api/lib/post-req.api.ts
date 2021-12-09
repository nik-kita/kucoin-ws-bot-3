import { BulletPrivateResType } from '../res-dto/bullet-private.dto';
import { BaseMethod } from './base-method.api';
import { POST } from './constants.api';

const { API_V1_BULLET_PRIVATE } = POST;
export class PostReq<ResType, ParamsType = any, BodyType = any> extends BaseMethod<ResType, ParamsType, BodyType> {
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
      PostReq<BulletPrivateResType>, 'setParams'
  >;
}
