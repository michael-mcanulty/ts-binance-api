import {IQueryOrder} from "./Interfaces/IQueryOrder";
import {BaseQueryOrder} from "./BaseQueryOrder";
import {IQueryOrderOpts} from "./Interfaces/IQueryOrderOpts";
import {IBaseQueryOrder} from "./Interfaces/IBaseQueryOrder";
import {IQueryCancelOrder} from "./Interfaces/IQueryCancelOrder";

export class QueryOrder extends BaseQueryOrder implements IQueryOrder {
	origClientOrderId: string;

	public toObjLiteral(): IQueryOrder{
		let self: IQueryOrder = this;
		let order: IQueryOrder = <IQueryOrder>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				order[prop] = self[prop];
			}
		}
		return order;
	}

	constructor(opts: IQueryOrderOpts) {
		let baseQuery: IBaseQueryOrder = <IBaseQueryOrder>{};
		baseQuery.orderId = opts.orderId;
		baseQuery.recvWindow = opts.recvWindow;
		baseQuery.symbol = opts.symbol;
		super(baseQuery);
		this.origClientOrderId = opts.origClientOrderId;
	}
}