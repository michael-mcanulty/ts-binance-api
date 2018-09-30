import {BaseQueryOrder} from "./BaseQueryOrder";
import {IAllOrders} from "./Interfaces/IAllOrders";
import {IGetAllOrdersOpts} from "./Interfaces/IGetAllOrdersOpts";

export class AllOrders extends BaseQueryOrder implements IAllOrders {
	limit: number;

	constructor(config: IGetAllOrdersOpts) {
		super(config.symbol, config.orderId, config.recvWindow);
		this.limit = config.limit || 500;
	}
}