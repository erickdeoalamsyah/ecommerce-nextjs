declare module "midtrans-client" {
  export class Snap {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    createTransaction(params: any): Promise<{ token: string }>;
  }

  export class CoreApi {
    constructor(config: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });

    charge(params: any): Promise<any>;
  }
}
