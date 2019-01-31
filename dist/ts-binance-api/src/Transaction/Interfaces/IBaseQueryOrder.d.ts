import { ISigned } from "../../Rest/Interfaces/ISigned";
export interface IBaseQueryOrder extends ISigned {
    orderId: number;
    recvWindow: number;
    symbol: string;
}
