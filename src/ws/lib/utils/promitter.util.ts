import EventEmitter from 'events';

export type TRmAction = {
    listener: (...args: any[]) => void,

    wsId: string,
}

export class Promitter {
    private emitter!: EventEmitter;

    public constructor() {
        this.emitter = new EventEmitter();
    }

    public on(label: string, cb: (...args: any[]) => void) {
        this.emitter.on(label, cb);
    }

    public rmListener(label: string, cb: (...args: any[]) => void) {
        this.emitter.removeListener(label, cb);
    }

    public waitFor(label: string) {
        return new Promise((resolve, reject) => {
            this.emitter.once(label, (data: any) => {
                resolve(data);
            });
            this.emitter.once(this.generateLabelForReject(label), (error: any) => {
                reject(error);
            });
        });
    }

    public emit(label: string, data?: any | any[]) {
        this.emitter.emit(label, data);
    }

    public emitReject(label: string, data?: any | any[]) {
        this.emitter.emit(this.generateLabelForReject(label), data);
    }

    private generateLabelForReject(label: string) {
        return `label-${label}`;
    }
}
