export class HttpError extends Error {
	code: number;
	message: string;

	constructor(msg: string, code: number) {
		super();
		this.message = msg;
		this.code = code;
	}
}

