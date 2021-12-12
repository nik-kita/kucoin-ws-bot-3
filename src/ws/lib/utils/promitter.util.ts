import EventEmitter from 'events';

export class Promitter {
    private emitter!: EventEmitter;

    public constructor() {
        this.emitter = new EventEmitter();
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

    public resolve(label: string, data?: any | any[]) {
        this.emitter.emit(label, data);
    }

    public reject(label: string, data?: any | any[]) {
        this.emitter.emit(this.generateLabelForReject(label), data);
    }

    private generateLabelForReject(label: string) {
        return `label-${label}`;
    }
}
