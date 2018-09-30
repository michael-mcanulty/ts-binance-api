import { IFill } from "./Interfaces/IFill";
export declare class Fill {
    price: number;
    qty: number;
    commission: number;
    commissionAsset: string;
    constructor(fill: IFill);
}
