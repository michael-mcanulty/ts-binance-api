import {Signed} from "../Rest/Signed";
import {EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class BaseOrder extends Signed {

	price: number;
	side: string;
	symbol: string;
	timeInForce: string;
	type: string;

	constructor(price: number, side: string, symbol: string, type: string, timeInForce: string) {
		super();
		this.price = price;
		this.side = side;
		this.symbol = symbol;
		this.type = type;
		let tForce: ETimeInForce;
		this.timeInForce = timeInForce;
		if (!timeInForce) {
			let goodTilCancelList: string[] = [EOrderType[EOrderType.LIMIT], EOrderType[EOrderType.STOP_LOSS_LIMIT], EOrderType[EOrderType.TAKE_PROFIT_LIMIT]];
			let isGoodTilCancelled: boolean = goodTilCancelList.includes(type);
			if (isGoodTilCancelled || !this.type) {
				this.timeInForce = ETimeInForce[ETimeInForce.GTC];
			}
		}
	}
}

