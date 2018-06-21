import {Auth} from "../../Account/Auth";

export interface iBinanceOptions {
	auth: Auth;
	test: boolean;
	useServerTime: boolean;
}