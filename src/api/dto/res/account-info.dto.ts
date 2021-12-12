export type AccountInfoResDto = [{
  id: string,
  currency: string,
  type: 'main' | 'trade' | 'margin' | 'pool',
  balance: string,
  available: string,
  holds: string,
}]
