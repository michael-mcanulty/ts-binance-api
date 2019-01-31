import { IQueryOrderOpts } from "./IQueryOrderOpts";
export interface ICancelOrderOpts extends IQueryOrderOpts {
    newClientOrderId: string;
}
