export class Price {
	symbol: string;
	value: number;

	public static GetPriceValue(prices: Price[], symbol: string): number {
		if (!prices || prices.length === 0) return 0;
		let priceFilter: Price[] = prices.filter(x => x.symbol === symbol);
		let price: number = 0;
		if (priceFilter.length > 0) {
			price = priceFilter[0].value;
		}
		return price;
	}
	constructor(symbol: string, value: string | number) {
		this.symbol = symbol;
		if (value) {
			this.value = parseFloat(value.toString());
		}
	}
}
