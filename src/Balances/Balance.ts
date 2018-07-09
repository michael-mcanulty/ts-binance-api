export class Balance {
	asset: string;
	available: number;
	date: Date;
	onOrder: number;

	constructor(asset: string, available: string, onOrder: string, date?: Date) {
		this.date = (date) ? date : new Date();
		this.asset = asset;
		this.available = parseFloat(available);
		this.onOrder = parseFloat(onOrder);
	}
}