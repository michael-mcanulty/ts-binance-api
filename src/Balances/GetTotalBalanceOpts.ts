import {IGetTotalBalanceOpts} from "./Interfaces/IGetTotalBalanceOpts";

export class GetTotalBalanceOpts implements IGetTotalBalanceOpts{
	quoteAsset?: string;
	usdAsset?: string;
	xChangeRatioBA?: string;
	recvWindow?: number;

	constructor(opts: IGetTotalBalanceOpts){
		this.usdAsset = opts.usdAsset || "USDT";
		this.xChangeRatioBA = opts.xChangeRatioBA || "BTC";
		this.quoteAsset = opts.quoteAsset || this.xChangeRatioBA;
		this.recvWindow = opts.recvWindow || 60000;
	}
}