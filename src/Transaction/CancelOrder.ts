import {IQueryCancelOrder} from "./Interfaces/IQueryCancelOrder";
import {QueryOrder} from "./QueryOrder";
import {IQueryOrderOpts} from "./Interfaces/IQueryOrderOpts";
import {ICancelOrderOpts} from "./Interfaces/ICancelOrderOpts";

export class CancelOrder extends QueryOrder implements IQueryCancelOrder {
	newClientOrderId?: string;

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