import {IBalanceStream} from "../../Balances/Interfaces/IBalanceStream";

export interface IOutboundAccountInfoStream {
	B: IBalanceStream[];
	D: boolean;
	E: number;
	T: boolean;
	W: boolean;
	b: number;
	e: string;
	m: number;
	s: number;
	t: number;
	u: number;
}