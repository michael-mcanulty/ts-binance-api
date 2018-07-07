import {Auth} from "../../Account/Auth";

export interface IBinanceOptions {
	auth: Auth;
	test: boolean;
	useServerTime: boolean;
}