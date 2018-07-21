export class BinanceApiAuth {
	private _key:string;

	get key(): string {
		return this._key;
	}

	set key(value: string) {
		this._key = value;
	}

	private _secret:string;

	get secret(): string {
		return this._secret;
	}

	set secret(value: string) {
		this._secret = value;
	}
}