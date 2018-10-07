import {BaseQueryOrder} from "./BaseQueryOrder";
import {IAllOrders} from "./Interfaces/IAllOrders";
import {IGetAllOrdersOpts} from "./Interfaces/IGetAllOrdersOpts";

export class AllOrders extends BaseQueryOrder implements IAllOrders {
	limit: number;

	public toObjLiteral(): IAllOrders{
		let self: IAllOrders = this;
		let allOrders: IAllOrders = <IAllOrders>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				allOrders[prop] = self[prop];
			}
		}
		return allOrders;
	}

	constructor(config: IGetAllOrdersOpts) {
		let all: IAllOrders = <IAllOrders>{};
		all.orderId = config.orderId;
		all.recvWindow = config.recvWindow;
		all.symbol = config.symbol;
		super(all);
		this.limit = config.limit || 500;
	}
}