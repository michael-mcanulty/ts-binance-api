# ts-binance-api
>Typescript API for Binance

```
import {
	Binance, IBinanceOptions, Order, Price, Market, CandleInterval, IMarketOrderOpts,
	ILimitOrderOpts, ICancelOrderOpts, ICancelOrderResponse, IGetOrderOpts,
	IGetAllOrdersOpts, CancelOrderResponse, ITotalBalance, IGetTotalBalanceOpts, I24hrTickerResponse, TickerVolume, Candle,
	EOrderSide
} from "@michael-mcanulty/ts-binance-api/dist";
```

```
export class Bot extends Binance {
	static binanceOptions: IBinanceOptions;

	async account(): Promise<OutboundAccountInfo> {
		return await this.rest.getAccountInfo();
	}

	async allOrders(symbol: string): Promise<Order[]> {
		let opts: IGetAllOrdersOpts = <IGetAllOrdersOpts>{};
		opts.symbol = symbol;
		return await this.rest.getAllOrders(opts);
	}

	async balances() {
		return await this.rest.getBalances();
	}

	async cancelOrderBySymbol(symbol: string): Promise<CancelOrderResponse[]> {
		let cancelled: ICancelOrderResponse[];
		let options: ICancelOrderOpts = <ICancelOrderOpts>{};
		options.symbol = symbol;
		cancelled = await this.rest.cancelOrdersBySymbol(options);
		return cancelled;
	}

	async get24hrTickers(symbol?: string): Promise<I24hrTickerResponse[]> {
		return await this.rest.get24hrTicker();
	}

	async getCandles(intervals: string[]): Promise<CandleInterval[]> {
		let symbols: string[] = ["ETHBTC"];
		let cIntervals: CandleInterval[] = [];
		for (let symbol of symbols) {
			let _intervals: CandleInterval[] = await this.rest.getCandlesBySymbol(symbol, intervals, 1000);
			cIntervals.push(..._intervals);
		}
		return cIntervals;
	}

	async getDataStream() {
		return await this.rest.getDataStream();
	}

	async limitSell(symbol: string, sellPrice: number, qty: number): Promise<Order> {
		let order: Order;
		let opts: ILimitOrderOpts = <ILimitOrderOpts>{};
		opts.symbol = symbol;
		opts.quantity = qty;
		opts.price = sellPrice;
		order = <Order> await this.rest.limitSell(opts);
		return order;
	}

	async marketBuy(symbol: string, quantity: number): Promise<Order> {
		let order: Order;
		let marketBuyOpts: IMarketOrderOpts = <IMarketOrderOpts>{};
		marketBuyOpts.symbol = symbol;
		marketBuyOpts.quantity = quantity;
		order = <Order> await this.rest.marketBuy(marketBuyOpts);
		return order;
	}

	async marketSell(symbol: string, quantity: number): Promise<Order> {
		let order: Order;
		let marketSellOpts: IMarketOrderOpts = <IMarketOrderOpts>{};
		marketSellOpts.symbol = symbol;
		marketSellOpts.quantity = quantity;
		order = <Order> await this.rest.marketSell(marketSellOpts);
		return order;
	}

	async markets(qa?: string): Promise<Market[]> {
		return await this.rest.getMarkets(qa);
	}

	async prices(): Promise<Price[]> {
		return await this.rest.getPrices();
	}

	async time() {
		return await this.rest.ping();
	}

	async totalAvailBalance(quoteAsset?: string): Promise<ITotalBalance[]> {
		let totalBalance: ITotalBalance[];
		let opts: IGetTotalBalanceOpts = <IGetTotalBalanceOpts>{};
		opts.quoteAsset = quoteAsset || undefined;
		totalBalance = await this.rest.getAvailableTotalBalance(opts);
		return totalBalance;
	}

	constructor(binanceOpts: IBinanceOptions) {
		super(binanceOpts);
	}
}

try {
	const binOpts = {
		"auth": {
			"key": "dsnflksdfwfdjflksflkjsdlkfjsdjsldjfcwhef0434322jrfoiwfe4wfreferf",
			"secret": "dsnflksdfwfdjflksflkjsdlkfjsdjsldjfcwhef0434322jrfoiwfe4wfreferf"
		},
		"test": true,
		"useServerTime": true,
		"emailServiceOpts": {
			"auth": {
				"pass": "FakePass",
				"user": "michael.mcanulty88@gmail.com"
			},
			"host": "smtp.gmail.com",
			"port": 465,
			"secure": true
		}
	};
	const bot = new Bot(binOpts);
	bot.marketBuy("BNBUSDT", 1).then(mb => console.log(mb));
} catch (err) {
	console.log(err);
}
```
