export type BulletPrivateResType = {
  token: string,
  instanceServers: [
      {
          endpoint: string,
          encrypt: number,
          protocol: string,
          pingInterval: number,
          pingTimeout: number,
      }
  ]
}
