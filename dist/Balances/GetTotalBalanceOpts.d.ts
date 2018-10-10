import { IGetTotalBalanceOpts } from "./Interfaces/IGetTotalBalanceOpts";
export declare class GetTotalBalanceOpts implements IGetTotalBalanceOpts {
    quoteAsset?: string;
    usdAsset?: string;
    xChangeRatioBA?: string;
    recvWindow?: number;
    constructor(opts: IGetTotalBalanceOpts);
}
