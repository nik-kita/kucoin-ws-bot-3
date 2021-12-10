/* eslint-disable max-classes-per-file */
import Ws, { WebSocket } from 'ws';
import { Req } from '../../api/req.api';
import {
    AckMessageDto, isAckMessageDto, isWelcomeMessageDto, WelcomeMessageDto,
} from './dto/utility-messages.dto';
import { IGeneralSubscribe } from './dto/ws-pub.dto';

const WAIT_FOR_CONNECT = 10_000;
const PING_PONG_INTERVAL = 30_000;

export abstract class BaseWs {
    protected isFirstConnection = true;

    protected waitForConnection!: Promise<void>;

    protected stopPingPong!: ReturnType<typeof setTimeout>;

    protected constructor(
        protected _ws: WebSocket,
        protected subDto: IGeneralSubscribe,
        protected afterConnect: (ws: WebSocket) => void,
    ) { }

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

            this._ws = new Ws(BaseWs.generateConnectedUrl(server.endpoint, token, id));

            await new Promise<void>((resolve, reject) => {
                const offTimer = setTimeout(
                    () => reject(new Error(`Socket didn't connect until expected ${WAIT_FOR_CONNECT} mms`)),
                    WAIT_FOR_CONNECT,
                );

                this._ws.once('message', (welcomeMessage: WelcomeMessageDto) => {
                    if (!isWelcomeMessageDto(welcomeMessage)) {
                        reject(new Error(`${welcomeMessage} is not of type ${WelcomeMessageDto.name}`));
                    }

                    this._ws.once('message', (ackMessage: AckMessageDto) => {
                        if (!isAckMessageDto(ackMessage, id)) {
                            reject(new Error(`${ackMessage} is not of type ${AckMessageDto.name}`));
                        }

                        clearTimeout(offTimer);

                        this.stopPingPong = setInterval(
                            () => this._ws.send(BaseWs.generatePingPayload(ackMessage.id)),
                            PING_PONG_INTERVAL,
                        );

                        this.afterConnect.call(this, this._ws);

                        resolve();
                    });
                });
            });
        } else {
            this.afterConnect.call(this, this._ws);
        }
    }

    private static generateConnectedUrl(endpoint: string, token: string, id: string) {
        return `${endpoint}?token=${token}&[id=${id}]`;
    }

    private static generatePingPayload(id: string) {
        return `{ "id": "${id}", "type": "ping" }`;
    }
}
