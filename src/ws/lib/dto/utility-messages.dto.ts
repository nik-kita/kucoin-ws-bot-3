/* eslint-disable max-classes-per-file */
export class BaseMessageDto {
    id!: string;

    type!: 'message' | 'ack' | 'welcome';
}

export class WelcomeMessageDto extends BaseMessageDto {
    id!: string;

    type!: 'welcome';
}

export class AckMessageDto extends BaseMessageDto {
    id!: string;

    type!: 'ack';
}
