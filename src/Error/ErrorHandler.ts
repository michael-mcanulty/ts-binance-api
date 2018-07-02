import {NodeMailer} from "./Email/App";
import {ErrorResolution} from "./ErrorResolution";
import {ErrorCode} from "./ErrorCode";
import {IMessageOptions} from "./Email/Interfaces/IMessageOptions";

export class ErrorHandler {
	private messageOptions: IMessageOptions;
	public static nodeMailer: NodeMailer;

	private _action: ErrorResolution;

	get action(): ErrorResolution {
		return this._action;
	}

	set action(value: ErrorResolution) {
		this._action = value;
	}

	private _error: ErrorCode;

	get error(): ErrorCode {
		return this._error;
	}

	set error(value: ErrorCode) {
		this._error = value;
	}

	public execute() {
		//send email
		//set timeout
	}

	constructor(code: number) {
		this.error = ErrorCode.GetErrorByCode(code);
		//TODO: this.action;
	}
}