import { GetReq } from './lib/get-req.api';
import { PostReq } from './lib/post-req.api';

export class Req {
    public static POST = PostReq;

    public static GET = GetReq;
}
