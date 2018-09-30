import {IFill} from "./Interfaces/IFill";

export class Fill{
	price: number;
	qty: number;
	commission: number;
	commissionAsset: string;

	constructor(fill: IFill){
		this.price = parseFloat(fill.price);
		this.qty = parseFloat(fill.qty);
		this.commission = parseFloat(fill.commission);
		this.commissionAsset = fill.commissionAsset;
	}
}