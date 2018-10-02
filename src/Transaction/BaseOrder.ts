import {Signed} from "../Rest/Signed";
import {EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";
import {IBaseOrder} from "./Interfaces/IBaseOrder";

export class BaseOrder extends Signed {
	price?: string;
	side: string;
	symbol: string;
	timeInForce?: string;
	type: string;

	constructor(base: IBaseOrder) {
		super();
		this.price = base.price;
		this.side = base.side;
		this.symbol = base.symbol;
		this.type = EOrderType[base.type];
		this.timeInForce = base.timeInForce;
		if (!base.timeInForce) {
			let goodTilCancelList: string[] = [EOrderType[EOrderType.LIMIT], EOrderType[EOrderType.STOP_LOSS_LIMIT], EOrderType[EOrderType.TAKE_PROFIT_LIMIT]];
			let isGoodTilCancelled: boolean = goodTilCancelList.includes(base.type);
			if (isGoodTilCancelled || !this.type) {
				this.timeInForce = ETimeInForce[ETimeInForce.GTC];
			}
		}
	}
}


