import { AccountInfroParamsDto } from '../dto/req/account-info-params.dto';
import { AccountInfoResDto } from '../dto/res/account-info.dto';
import { BaseMethod } from './base-method.api';
import { GET } from './constants.api';

const { API_V1_ACCOUNTS } = GET;

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
}
