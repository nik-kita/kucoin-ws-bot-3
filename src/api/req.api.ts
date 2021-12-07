/* eslint-disable max-classes-per-file */
/* eslint-disable no-unused-expressions */

import axios from 'axios';
import { SignGenerator } from './sign-generator.api';

/* eslint-disable max-classes-per-file */
const HOST = 'https://api.kucoin.com';
const API_V1_BULLET_PRIVATE = '/api/v1/bullet-private';

class PostReq {
    private method = 'POST' as const;

    private constructor(
    private endpoint: string,
    private params?: object,
    private body?: object,
    ) { }

    public static [API_V1_BULLET_PRIVATE] = new PostReq(API_V1_BULLET_PRIVATE);

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

        return data;
    }
}

class Req {
    public static POST = PostReq;
}

Req.POST['/api/v1/bullet-private'];
