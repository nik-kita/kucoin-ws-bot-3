/* eslint-disable max-classes-per-file */
import Ws, { WebSocket } from 'ws';
import { Req } from '../../api/req.api';
import { AfterConnectCb, CONSOLE_LOG_CB } from './after-connect-cb';
import {
    AckMessageDto, isAckMessageDto, isWelcomeMessageDto, WelcomeMessageDto,
} from './dto/utility-messages.dto';
import { IGeneralPublish } from './dto/ws-pub.dto';
import { Promitter } from './utils/promitter.util';

const WAIT_FOR_CONNECT = 10_000;
const PING_PONG_INTERVAL = 30_000;

export abstract class BaseWs {
    protected promitter!: Promitter;

    protected isFirstConnection = true;

    protected stopPingPong!: typeof clearInterval;

    protected _ws!: WebSocket;

    protected constructor(
        protected subDto: IGeneralPublish,
        protected afterConnect: AfterConnectCb = CONSOLE_LOG_CB,
    ) {
        this.promitter = new Promitter();
    }

    public disconnect() {
        this.stopPingPong();
        this._ws.close();

        return this.promitter.waitFor('close');
    }

    public async connect() {
        if (this.isFirstConnection) {
            this.isFirstConnection = false;

            const bulletRes = await Req.POST['/api/v1/bullet-private'].exec();

            if (!bulletRes) {
                throw new Error('Unable to POST /api/v1/bullet-private');
            }
            const { instanceServers, token } = bulletRes;
            const [server] = instanceServers;
            const { id } = this.subDto;

            this._ws = new Ws(this.generateConnectedUrl(server.endpoint, token, id));
            const waitForConnect = this.promitter.waitFor('connect');
            const offTimer = setTimeout(
                () => this.promitter.reject(
                    'connect',
                    new Error(`Socket didn't connect until expected ${WAIT_FOR_CONNECT} mms`),
                ),
                WAIT_FOR_CONNECT,
            );

            this._ws.once('message', (welcomeMessage: WelcomeMessageDto) => {
                if (!isWelcomeMessageDto(welcomeMessage)) {
                    this.promitter.reject(
                        'connect',
                        new Error(`${welcomeMessage} is not of type ${WelcomeMessageDto.name}`),
                    );
                }

                this._ws.once('message', (ackMessage: AckMessageDto) => {
                    if (!isAckMessageDto(ackMessage, id)) {
                        this.promitter.reject(
                            'connect',
                            new Error(`${ackMessage} is not of type ${AckMessageDto.name}`),
                        );
                    }

                    clearTimeout(offTimer);

                    this.stopPingPong = clearInterval.bind(
                        this,
                        setInterval(
                            () => this._ws.send(this.generatePingPayload(ackMessage.id)),
                            PING_PONG_INTERVAL,
                        ),
                    );

                    this.afterConnect.call(this, this._ws);

                    this.promitter.resolve('connect');
                });
            }).on('open', () => {
                this._ws.send(JSON.stringify(this.subDto));
            }).on('close', () => {
                this.promitter.resolve('close');
            });
            await waitForConnect;
        } else {
            this.afterConnect.call(this, this._ws);
        }

        return this;
    }

    private generateConnectedUrl(endpoint: string, token: string, id: string) {
        return `${endpoint}?token=${token}&[id=${id}]`;
    }

    private generatePingPayload(id: string) {
        return `{ "id": "${id}", "type": "ping" }`;
    }
}
