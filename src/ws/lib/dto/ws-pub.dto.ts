export interface IGeneralSubscribe {
  id: string;

  type: 'subscribe' | 'unsubscribe';

  topic: string;

  response: boolean;
}
