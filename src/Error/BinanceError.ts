import {EErrorType} from "./Email/Enums/EErrorType";
import {ErrorHandler} from "./ErrorHandler";

export class BinanceError {
	private static TOO_MANY_REQUESTS_CODE: number = -1003;
	public static all: BinanceError[];
	code: number;
	handler?: ErrorHandler;
	msg: string;

	public static GetBinanceErrorByCode(code: number): BinanceError | null {
		let filtered: BinanceError[] = BinanceError.all.filter(handler => handler.code === code);
		let result: BinanceError;
		if (filtered && filtered.length > 0) {
			result = filtered[0];
		}
		return result;
	}

	public static GetTimeoutFromIPBannedMsg(err: BinanceError): number {
		let strFloat: string;
		let result: number = 0;
		if (err && err.msg) {
			let msg: string = "IP banned until ";
			let startIdx = err.msg.indexOf(msg) + msg.length;
			let float = parseFloat(err.msg.slice(startIdx, startIdx + 13));
			strFloat = float.toString();
			if (strFloat.length === 13) {
				result = float - new Date().getTime();
			}
		}
		return result;
	}

	constructor(err: BinanceError) {
		this.code = parseInt(err.code.toString());
		this.msg = (typeof err['msg'] === "string") ? err['msg'] : err['message'];
		let matched: BinanceError | null = BinanceError.GetBinanceErrorByCode(this.code);
		if (matched !== null) {
			this.handler = ErrorHandler.GetErrorHandler(this.code, EErrorType.Binance);
			if (this.code === BinanceError.TOO_MANY_REQUESTS_CODE) {
				this.handler.timeout = BinanceError.GetTimeoutFromIPBannedMsg(err);
			}
		}
	}
}