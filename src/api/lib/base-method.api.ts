import axios from 'axios';
import { HOST } from './constants.api';
import { SignGenerator } from './sign-generator.api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export class BaseMethod<ResType, ParamsType = any, BodyType = any> {
    protected constructor(
      private method: 'GET' | 'POST',
      protected endpoint: string,
      protected params?: object,
      protected body?: object,
    ) { }

    protected paramsResolver: (params: any) => any = (params: any) => params;

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

    public setParams(params: ParamsType) {
      this.params! = this.paramsResolver(params);

      return this;
    }
}
