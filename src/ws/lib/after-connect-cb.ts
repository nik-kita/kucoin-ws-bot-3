import { WebSocket } from 'ws';

export type AfterConnectCb = (ws: WebSocket) => void;

class AfterConnectCallBacks {
    public static CONSOLE_LOG_CB: AfterConnectCb = (ws) => {
        ws.on('message', (data: any) => {
            const message = JSON.parse(data);

            console.log(message);
        });
    };
}

export const {
    CONSOLE_LOG_CB,
} = AfterConnectCallBacks;
