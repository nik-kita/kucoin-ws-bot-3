/* eslint-disable max-classes-per-file */
import { WebSocket } from 'ws';
import { BaseMessageDto } from '../../lib/dto/utility-messages.dto';

export type TData = {
  bestAsk: string,
  bestAskSize: string,
  bestBid: string,
  betsBidSize: string,
  price: string,
  lastPrice: string,
  startPrice: string,
  sequence: string,
  size: string,
  time: number,
  lastTime: number,
  startTime: number,
  agio?: number,
}

export class MarketTickerMessageDto extends BaseMessageDto {
    target!: WebSocket;

    type!: 'message';

    topic!: string;

    subject!: string;

    data!: TData;
}
