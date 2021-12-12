/* eslint-disable max-classes-per-file */

import { v4 } from 'uuid';
import Ws, { WebSocket } from 'ws';
import { Req } from '../api/req.api';
import { BaseMessageDto } from './lib/dto/utility-messages.dto';
import { Promitter } from './lib/utils/promitter.util';

const PING_PONG_INTERVAL = 30_000;

export class KucoinWs {
    protected _ws!: WebSocket;

    protected id!: string;

    protected stopPingPong!: typeof clearInterval;

    protected promitter!: Promitter;

    protected constructor() {
        this.promitter = new Promitter();
        this.id = v4();
    }

    public static async open() {
        const bulletRes = await Req.POST['/api/v1/bullet-private'].exec();
        const { instanceServers, token } = bulletRes!;
        const [server] = instanceServers;

        const kucoinWs = new KucoinWs();
        const waitForOpen = kucoinWs.promitter.waitFor('open').then(() => {
            kucoinWs.stopPingPong = clearInterval.bind(
                this,
                setInterval(
                    () => kucoinWs._ws.send(KucoinWs.generatePingPayload(kucoinWs.id)),
                    PING_PONG_INTERVAL,
                ),
            );
        });

        kucoinWs._ws = new Ws(KucoinWs.generateConnectedUrl(server.endpoint, token, kucoinWs.id))
            .on('message', (data: any) => {
                const message = JSON.parse(data) as BaseMessageDto;

                kucoinWs.promitter.emit(message.type, message);
            }).on('open', () => {
                kucoinWs.promitter.emit('open');
            }).on('close', () => {
                kucoinWs.promitter.emit('close');
            });

        await waitForOpen;

        return kucoinWs;
    }

    public close() {
        const closePromise = this.promitter.waitFor('close');

        this.stopPingPong();
        this._ws.close();

        return closePromise;
    }

    private static generateConnectedUrl(endpoint: string, token: string, id: string) {
        return `${endpoint}?token=${token}&[id=${id}]`;
    }

    private static generatePingPayload(id: string) {
        return `{ "id": "${id}", "type": "ping" }`;
    }
}
