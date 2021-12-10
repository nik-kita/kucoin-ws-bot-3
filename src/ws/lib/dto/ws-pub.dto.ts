export interface IGeneralPublish {
  id: string;

  type: 'subscribe' | 'unsubscribe';

  topic: string;

  response: boolean;
}
