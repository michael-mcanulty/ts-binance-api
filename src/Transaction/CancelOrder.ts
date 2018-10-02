import {IQueryCancelOrder} from "./Interfaces/IQueryCancelOrder";
import {QueryOrder} from "./QueryOrder";
import {IQueryOrderOpts} from "./Interfaces/IQueryOrderOpts";
import {ICancelOrderOpts} from "./Interfaces/ICancelOrderOpts";
import {INewOrder} from "./Interfaces/INewOrder";
import {NewOrder} from "./NewOrder";

export class CancelOrder extends QueryOrder implements IQueryCancelOrder {
	newClientOrderId?: string;

	public toObjLiteral(): IQueryCancelOrder{
		let self: IQueryCancelOrder = this;
		let order: IQueryCancelOrder = <IQueryCancelOrder>{};
		for (let prop in self){
			if (self[prop] && typeof self[prop] !== "function") {
				order[prop] = self[prop];
			}
		}
		return order;
	}

	constructor(opts: ICancelOrderOpts) {
		let qOpts: IQueryOrderOpts = <IQueryOrderOpts>{};
		qOpts.orderId = opts.orderId;
		qOpts.origClientOrderId = opts.origClientOrderId;
		qOpts.recvWindow = opts.recvWindow;
		qOpts.symbol = opts.symbol;
		super(qOpts);
		this.newClientOrderId = opts.newClientOrderId;
	}
}