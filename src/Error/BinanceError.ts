import {HttpErrorHandler} from "./HttpErrorHandler";

export class BinanceError {
	private static TOO_MANY_REQUESTS_CODE: number = -1003;
	public static all: BinanceError[] | Error[];
	code: number;
	handler?: HttpErrorHandler;
	workerIdOrigin?:number;
	msg: string;



	constructor() {
		//TODO: BinanceError.GetTimeoutFromIPBannedMsg(err);
	}
}