export class Price {
	symbol: string;
	value: number;
	constructor(symbol: string, value: string | number) {
		this.symbol = symbol;
		if (value) {
			this.value = parseFloat(value.toString());
		}
	}
}
