import {Signed} from "../Rest/Signed";
import {EOrderSide, EOrderType, ETimeInForce} from "./Interfaces/EOrderEnums";

export class BaseOrder extends Signed {

	price: number;
	side: EOrderSide;
	symbol: string;
	timeInForce: ETimeInForce;
	type: EOrderType;

	constructor(price: string, side: string, symbol: string, timeInForce: string, type: string) {
		super();
		this.price = parseFloat(price);
		this.side = EOrderSide[side];
		this.symbol = symbol;
		this.type = EOrderType[type];
		let tForce: ETimeInForce;
		this.timeInForce = ETimeInForce[timeInForce];
		if (!timeInForce) {
			let goodTilCancelList: string[] = [EOrderType[EOrderType.LIMIT], EOrderType[EOrderType.STOP_LOSS_LIMIT], EOrderType[EOrderType.TAKE_PROFIT_LIMIT]];
			let isGoodTilCancelled: boolean = goodTilCancelList.includes(type);
			if (isGoodTilCancelled || !this.type) {
				tForce = ETimeInForce.GTC;
				this.timeInForce = tForce;
			}
		}
	}
}

