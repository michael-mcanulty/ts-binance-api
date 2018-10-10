import {IGetTotalBalanceOpts} from "./Interfaces/IGetTotalBalanceOpts";

export class GetTotalBalanceOpts implements IGetTotalBalanceOpts{
	quoteAsset?: string;
	usdAsset?: string;
	xChangeRatioBA?: string;
	recvWindow?: number;

	public toObjLiteral(): IGetTotalBalanceOpts{
		let self: GetTotalBalanceOpts = this;
		let order: IGetTotalBalanceOpts = <IGetTotalBalanceOpts>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				order[prop] = self[prop];
			}
		}
		return order;
	}
	
	constructor(opts: IGetTotalBalanceOpts){
		this.usdAsset = opts.usdAsset || "USDT";
		this.xChangeRatioBA = opts.xChangeRatioBA || "BTC";
		this.quoteAsset = opts.quoteAsset || this.xChangeRatioBA;
		this.recvWindow = opts.recvWindow || 60000;
	}
}