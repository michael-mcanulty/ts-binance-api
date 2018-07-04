import {EErrorType} from "./Email/Enums/EErrorType";
import {BinanceError} from "./BinanceError";
import {ErrorHandler} from "./ErrorHandler";

export class HttpError extends Error {
	public static all: HttpError[];
	code: number;
	handler?: ErrorHandler;
	message: string;

	public static GetErrorType(err: BinanceError | HttpError): EErrorType {
		let code: number = parseInt(err.code.toString());
		let isBinance: boolean = false;
		if (typeof err['msg'] === "string" && code < 0) {
			isBinance = true;
		}
		return (isBinance) ? EErrorType.Binance : EErrorType.Node;
	}

	public static GetHttpErrorByCode(code: number): HttpError | null {
		let filtered: HttpError[] = HttpError.all.filter(handler => handler.code === code);
		let result: HttpError;
		if (filtered && filtered.length > 0) {
			result = filtered[0];
		}
		return result;
	}

	constructor(err: BinanceError | HttpError | any) {
		super();
		console.log(err);
		this.code = parseInt(err.code.toString());
		let type: EErrorType = HttpError.GetErrorType(err);
		this.message = (type === EErrorType.Binance) ? err['msg'] : err['message'];
		if (type === EErrorType.Binance) {
			let matched: BinanceError | null = BinanceError.GetBinanceErrorByCode(this.code);
			if (matched !== null) {
				this.handler = ErrorHandler.GetErrorHandler(this.code, EErrorType.Binance);
			}
		} else {
			let matched: HttpError | null = HttpError.GetHttpErrorByCode(this.code);
			if (matched !== null) {
				this.handler = ErrorHandler.GetErrorHandler(this.code, EErrorType.Node);
			}
		}
	}
}
