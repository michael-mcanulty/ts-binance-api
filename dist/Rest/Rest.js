"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotHttp_1 = require("./BotHttp");
const CandleInterval_1 = require("../ExchangeInfo/CandleInterval");
const Candle_1 = require("../ExchangeInfo/Candle");
const Market_1 = require("../Market/Market");
const Binance_1 = require("../Binance/Binance");
const NewOrder_1 = require("../Transaction/NewOrder");
const Order_1 = require("../Transaction/Order");
const CancelOrder_1 = require("../Transaction/CancelOrder");
const DataStream_1 = require("./DataStream");
const CallOptions_1 = require("./CallOptions");
const OpenOrder_1 = require("../Transaction/OpenOrder");
const QueryOrder_1 = require("../Transaction/QueryOrder");
const AllOrders_1 = require("../Transaction/AllOrders");
const OutboundAccountInfo_1 = require("../Account/OutboundAccountInfo");
const AccountInfoOptions_1 = require("../Account/AccountInfoOptions");
const CancelOrderResponse_1 = require("../Transaction/CancelOrderResponse");
const TestOrder_1 = require("../Transaction/TestOrder");
const Price_1 = require("../Transaction/Price");
const GetTotalBalanceOpts_1 = require("../Balances/GetTotalBalanceOpts");
class Rest extends BotHttp_1.BotHttp {
    constructor(options) {
        super(options);
        this._markets = [];
    }
    set markets(markets) {
        (async () => {
            if (markets) {
                this._markets = await markets;
            }
        })();
    }
    get markets() {
        return new Promise(async (resolve, reject) => {
            try {
                if (this._markets && this._markets.length > 0) {
                    return resolve(this._markets);
                }
                else {
                    this._markets = await this.getMarkets();
                    return resolve(this._markets);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    async _cancelOrder(cancelOrder) {
        try {
            let callConfig = {};
            let orderResRaw;
            let response;
            let privateOrder;
            let callOpts;
            callConfig.uri = (Binance_1.Binance.options.test) ? `${BotHttp_1.BotHttp.BASE}/api/v3/order/test` : `${BotHttp_1.BotHttp.BASE}/api/v3/order`;
            callConfig.method = 'DELETE';
            callConfig.json = true;
            callConfig.isSigned = true;
            callConfig.qs = cancelOrder;
            callOpts = new CallOptions_1.CallOptions(callConfig);
            privateOrder = await this.privateCall(callOpts);
            if (privateOrder instanceof Error) {
                return Promise.reject(privateOrder);
            }
            else {
                orderResRaw = privateOrder;
                response = new CancelOrderResponse_1.CancelOrderResponse(orderResRaw);
                return response;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async _getCandlesInterval(candleOpts) {
        let lastCandle;
        let lastIdx;
        let now;
        let candles;
        let raw;
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/klines`;
        callConfig.qs = candleOpts;
        callConfig.isSigned = false;
        callOpts = new CallOptions_1.CallOptions(callConfig);
        try {
            raw = await this.call(callOpts);
            now = Date.now();
            candles = Candle_1.Candle.fromRestStream(raw, candleOpts.symbol, candleOpts.interval);
            lastIdx = candles.length - 1;
            lastCandle = candles[lastIdx];
            if (lastCandle.closeTime.getTime() > now) {
                candles.splice(lastIdx, 1);
            }
            return candles;
        }
        catch (err) {
            throw err;
        }
    }
    ;
    async _newOrder(order) {
        let self = this;
        let callOpts;
        let callConfig = {};
        let orderRes;
        let privateOrder;
        callConfig.uri = (Binance_1.Binance.options.test) ? `${BotHttp_1.BotHttp.BASE}/api/v3/order/test` : `${BotHttp_1.BotHttp.BASE}/api/v3/order`;
        callConfig.method = 'POST';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.qs = order.toObjLiteral();
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            privateOrder = await self.privateCall(callOpts);
            if (self.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
                return new TestOrder_1.TestOrder();
            }
            else {
                if (privateOrder instanceof Error) {
                    return Promise.reject(privateOrder);
                }
                else {
                    let order = privateOrder;
                    orderRes = new Order_1.Order(order);
                    return orderRes;
                }
            }
        }
        catch (err) {
            throw err;
        }
    }
    async cancelOrder(options) {
        try {
            let cancelResult;
            let result;
            let cancelOrder = new CancelOrder_1.CancelOrder(options);
            if (cancelOrder && cancelOrder.orderId) {
                cancelResult = await this._cancelOrder(cancelOrder);
                result = new CancelOrderResponse_1.CancelOrderResponse(cancelResult);
            }
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async cancelOrdersBySymbol(options) {
        let cOpts;
        let symbolOrders;
        let openOrders;
        let cancelResp;
        let results = [];
        let config = {};
        config.symbol = options.symbol;
        config.origClientOrderId = options.origClientOrderId;
        config.orderId = options.orderId;
        config.recvWindow = options.recvWindow;
        try {
            openOrders = await this.getOpenOrders(config);
            if (!openOrders || openOrders.length === 0) {
                return [];
            }
            symbolOrders = openOrders.filter(order => order.symbol === config.symbol);
            for (let order of symbolOrders) {
                cOpts = {};
                cOpts.orderId = order.orderId;
                cOpts.recvWindow = options.recvWindow;
                cOpts.origClientOrderId = order.clientOrderId;
                cOpts.symbol = order.symbol;
                cOpts.newClientOrderId = options.newClientOrderId;
                cancelResp = await this.cancelOrder(cOpts);
                results.push(cancelResp);
            }
            return results;
        }
        catch (err) {
            throw err;
        }
    }
    async closeDataStream() {
        let callOpts;
        let result;
        let callConfig = {};
        callConfig.method = 'DELETE';
        callConfig.json = true;
        callConfig.isSigned = false;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/userDataStream`;
        callConfig.qs = new DataStream_1.DataStream(Rest.listenKey);
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            result = await this.privateCall(callOpts);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async getAccountInfo(recvWindow) {
        let self = this;
        let callOpts;
        let accountInfoRest;
        let info;
        let opts = new AccountInfoOptions_1.AccountInfoOptions(recvWindow);
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v3/account`;
        callConfig.qs = opts;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            accountInfoRest = await self.privateCall(callOpts);
            info = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceRest(accountInfoRest);
            return info;
        }
        catch (err) {
            throw err;
        }
    }
    async getAllCandles(symbols, intervals, limit) {
        try {
            let candleIntervals = [];
            for (let symbol of symbols) {
                for (let interval of intervals) {
                    let req = {};
                    req.symbol = symbol;
                    req.interval = interval;
                    req.limit = limit;
                    let candles = await this._getCandlesInterval(req);
                    let ci = new CandleInterval_1.CandleInterval(candles);
                    candleIntervals.push(ci);
                }
            }
            return candleIntervals;
        }
        catch (err) {
            throw err;
        }
    }
    ;
    async getAllOrders(options) {
        let results;
        let privateCall;
        let query;
        let callOpts;
        let callConfig = {};
        query = new AllOrders_1.AllOrders(options);
        results = [];
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v3/allOrders`;
        callConfig.qs = query.toObjLiteral();
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            privateCall = await this.privateCall(callOpts);
            if (Array.isArray(privateCall) && privateCall.length > 0) {
                results = privateCall.map((qCall) => {
                    let opts = {};
                    opts.cummulativeQuoteQty = qCall.cummulativeQuoteQty;
                    opts.symbol = qCall.symbol;
                    opts.side = qCall.side;
                    opts.type = qCall.type;
                    opts.price = qCall.price;
                    opts.clientOrderId = qCall.clientOrderId;
                    opts.orderId = qCall.orderId;
                    opts.executedQty = qCall.executedQty;
                    opts.origQty = qCall.origQty;
                    opts.transactTime = qCall.time;
                    opts.status = qCall.status;
                    opts.signature = qCall.signature;
                    opts.timeInForce = qCall.timeInForce;
                    opts.isWorking = qCall.isWorking;
                    return new Order_1.Order(opts);
                });
            }
            return results;
        }
        catch (err) {
            throw err;
        }
    }
    async getAvailableTotalBalance(opts) {
        let results = [];
        let result = {};
        let prices;
        let balances;
        let config;
        let balVals;
        try {
            config = new GetTotalBalanceOpts_1.GetTotalBalanceOpts(opts);
            balances = await this.getBalances(config.recvWindow, true);
            prices = await this.getPrices();
            if (balances.length === 0) {
                return Promise.reject(new Error("Error: Balances not working"));
            }
            const QA = config.quoteAsset;
            const USDT = config.usdAsset;
            const BTC = config.xChangeRatioBA;
            balVals = [];
            result = {};
            balances.forEach((bal) => {
                let exchangeValue;
                let totalBTCVal;
                let avail = {};
                let BA = bal.asset;
                let available = bal.available;
                let symbol;
                if (BA !== BTC && BTC !== QA) {
                    symbol = BA + BTC;
                    exchangeValue = Price_1.Price.GetPriceValue(prices, symbol);
                    avail.quoteAsset = QA;
                    totalBTCVal = available * exchangeValue;
                    avail.totalVal = totalBTCVal * Price_1.Price.GetPriceValue(prices, BTC + USDT);
                    balVals.push(avail);
                }
                else {
                    if (BA === BTC && BTC !== QA) {
                        avail.quoteAsset = QA;
                        avail.totalVal = available * Price_1.Price.GetPriceValue(prices, BTC + USDT);
                        balVals.push(avail);
                    }
                    else if (QA === BTC && BA !== BTC) {
                        symbol = BA + QA;
                        exchangeValue = Price_1.Price.GetPriceValue(prices, symbol);
                        avail.quoteAsset = QA;
                        avail.totalVal = available * exchangeValue;
                        balVals.push(avail);
                    }
                    else if (BTC === QA && BA === BTC) {
                        avail.quoteAsset = QA;
                        avail.totalVal = available;
                        balVals.push(avail);
                    }
                }
            });
            result.totalVal = balVals.reduce((prev, cur) => {
                return prev + cur.totalVal;
            }, 0);
            result.quoteAsset = QA;
            results.push(result);
            if (QA !== USDT) {
                let result2 = {};
                result2.totalVal = result.totalVal * Price_1.Price.GetPriceValue(prices, BTC + USDT);
                result2.quoteAsset = "USDT";
                results.push(result2);
            }
            return results;
        }
        catch (err) {
            throw err;
        }
    }
    async getBalances(recvWindow, gtZeroOnly = true) {
        try {
            let balances;
            let accountInfo = await this.getAccountInfo(recvWindow);
            balances = accountInfo.balances;
            if (gtZeroOnly && accountInfo.balances.length > 0) {
                balances = accountInfo.balances.filter(bal => bal.available > 0);
            }
            else {
                balances = accountInfo.balances;
            }
            return balances;
        }
        catch (err) {
            throw err;
        }
    }
    async getCandlesBySymbol(symbol, intervals, limit) {
        let candleIntervals = [];
        try {
            for (let interval of intervals) {
                let req = {};
                req.symbol = symbol;
                req.interval = interval;
                req.limit = limit;
                let candles = await this._getCandlesInterval(req);
                let ci = new CandleInterval_1.CandleInterval(candles);
                candleIntervals.push(ci);
            }
            return candleIntervals;
        }
        catch (err) {
            throw err;
        }
    }
    ;
    async getDataStream() {
        let callOpts;
        let callConfig;
        callConfig = {};
        callConfig.method = 'POST';
        callConfig.json = true;
        callConfig.isSigned = false;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/userDataStream`;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            Rest.listenKey = await this.privateCall(callOpts);
            return Rest.listenKey;
        }
        catch (err) {
            throw err;
        }
    }
    async getDepositAddress(request) {
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/wapi/v3/depositAddress.html`;
        callConfig.qs = request;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            return await this.privateCall(callOpts);
        }
        catch (err) {
            throw err;
        }
    }
    async getDepositHisory(request) {
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/wapi/v3/depositHistory.html`;
        callConfig.qs = request;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            return await this.privateCall(callOpts);
        }
        catch (err) {
            throw err;
        }
    }
    async getExchangeInfo() {
        let self = this;
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/exchangeInfo`;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            return await self.call(callOpts);
        }
        catch (err) {
            throw err;
        }
    }
    async getMarkets(quoteAsset) {
        try {
            let self = this;
            let info = await self.getExchangeInfo();
            let symbols = info.symbols;
            let markets = symbols.map(symbol => {
                return new Market_1.Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market_1.Market.GetLimitsFromBinanceSymbol(symbol));
            });
            if (quoteAsset && markets.length > 0) {
                this._markets = markets.filter(m => m.quoteAsset === quoteAsset);
                return this._markets;
            }
            else {
                this._markets = markets;
                return markets;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getOpenOrders(options) {
        let opts = {};
        let query;
        let callOpts;
        let privateCall;
        let callConfig = {};
        try {
            opts.symbol = options.symbol;
            opts.recvWindow = options.recvWindow;
            opts.orderId = options.orderId;
            opts.origClientOrderId = options.origClientOrderId;
            query = new QueryOrder_1.QueryOrder(opts);
            callConfig.method = 'GET';
            callConfig.json = true;
            callConfig.isSigned = true;
            callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v3/openOrders`;
            callConfig.qs = query.toObjLiteral();
            callOpts = new CallOptions_1.CallOptions(callConfig);
            privateCall = await this.privateCall(callOpts);
            if (Array.isArray(privateCall) && privateCall.length > 0) {
                return privateCall.map((o) => {
                    return new OpenOrder_1.OpenOrder(o);
                });
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getOrder(options) {
        try {
            let query;
            let callOpts;
            let privateCall;
            let result;
            let opts = {};
            opts.symbol = options.symbol;
            opts.recvWindow = options.recvWindow;
            opts.orderId = options.orderId;
            opts.origClientOrderId = options.origClientOrderId;
            query = new QueryOrder_1.QueryOrder(opts);
            let callConfig = {};
            callConfig.method = 'GET';
            callConfig.json = true;
            callConfig.isSigned = true;
            callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v3/order`;
            callConfig.qs = query.toObjLiteral();
            callOpts = new CallOptions_1.CallOptions(callConfig);
            privateCall = await this.privateCall(callOpts);
            if (privateCall && privateCall.hasOwnProperty("symbol")) {
                let nOrder = {};
                nOrder.symbol = opts.symbol;
                nOrder.side = privateCall.side;
                nOrder.price = privateCall.price;
                nOrder.type = privateCall.type;
                nOrder.timeInForce = privateCall.timeInForce;
                nOrder.origQty = privateCall.origQty;
                nOrder.executedQty = privateCall.executedQty;
                nOrder.timestamp = privateCall.time;
                nOrder.status = privateCall.status;
                nOrder.orderId = opts.orderId;
                nOrder.clientOrderId = privateCall.clientOrderId;
                nOrder.cummulativeQuoteQty = privateCall.cummulativeQuoteQty;
                nOrder.status = privateCall.status;
                nOrder.signature = privateCall.signature;
                nOrder.transactTime = privateCall.time;
                nOrder.isWorking = privateCall.isWorking;
                result = new Order_1.Order(nOrder);
                return result;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async get24hrTicker(symbol) {
        let self = this;
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/ticker/24hr`;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            if (symbol && typeof symbol === "string") {
                return [await self.call(callOpts)];
            }
            else {
                return await self.call(callOpts);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getPrices() {
        let self = this;
        let rawPrices;
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = false;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v3/ticker/price`;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            rawPrices = await self.call(callOpts);
            if (Array.isArray(rawPrices) && rawPrices.length > 0) {
                return Price_1.Price.toPrices(rawPrices);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getStatus() {
        let self = this;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.apiKey = self.options.auth.key;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/wapi/v3/systemStatus.html`;
        try {
            let opts = new CallOptions_1.CallOptions(callConfig);
            return await self.call(opts);
        }
        catch (err) {
            return Promise.reject(new Error(`Error retrieving the system status. Message: ${err}`));
        }
    }
    async getWithdrawHisory(request) {
        let self = this;
        let withdrawHistory;
        let callOpts;
        let callConfig = {};
        callConfig.method = 'GET';
        callConfig.json = true;
        callConfig.isSigned = true;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/wapi/v3/withdrawHistory.html`;
        callConfig.qs = request;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            withdrawHistory = await self.privateCall(callOpts);
            return withdrawHistory;
        }
        catch (err) {
            throw err;
        }
    }
    async keepDataStream() {
        let self = this;
        let dStream;
        let callOpts;
        let callConfig = {};
        dStream = new DataStream_1.DataStream(Rest.listenKey);
        callConfig.method = 'PUT';
        callConfig.json = true;
        callConfig.isSigned = false;
        callConfig.uri = `${BotHttp_1.BotHttp.BASE}/api/v1/userDataStream`;
        callConfig.qs = dStream;
        try {
            callOpts = new CallOptions_1.CallOptions(callConfig);
            return await self.privateCall(callOpts);
        }
        catch (err) {
            throw err;
        }
    }
    async limitBuy(options) {
        let self = this;
        let orderObj;
        let nOrder = {};
        const TYPE = 'LIMIT';
        const SIDE = 'BUY';
        const RESPONSE_TYPE = 'FULL';
        try {
            if (options && options.price) {
                nOrder.timeInForce = options.timeInForce;
                nOrder.price = options.price.toString();
                nOrder.symbol = options.symbol;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = TYPE;
                nOrder.side = SIDE;
                nOrder.quantity = options.quantity;
                nOrder.stopPrice = options.stopPrice;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = options.newOrderRespType || RESPONSE_TYPE;
                orderObj = new NewOrder_1.NewOrder(nOrder);
                return await self._newOrder(orderObj);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async limitSell(options) {
        try {
            let order;
            let nOrder = {};
            const TYPE = 'LIMIT';
            const SIDE = 'SELL';
            const RESPONSE_TYPE = 'FULL';
            if (options && options.price) {
                nOrder.timeInForce = options.timeInForce;
                nOrder.price = options.price.toString();
                nOrder.symbol = options.symbol;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = TYPE;
                nOrder.side = SIDE;
                nOrder.quantity = options.quantity;
                nOrder.stopPrice = options.stopPrice;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = options.newOrderRespType || RESPONSE_TYPE;
                order = new NewOrder_1.NewOrder(nOrder);
                return await this._newOrder(order);
            }
        }
        catch (err) {
            throw err;
        }
    }
    async marketBuy(options) {
        let self = this;
        let order;
        let nOrder = {};
        try {
            nOrder.recvWindow = options.recvWindow;
            nOrder.type = 'MARKET';
            nOrder.side = 'BUY';
            nOrder.quantity = options.quantity;
            nOrder.symbol = options.symbol;
            nOrder.recvWindow = options.recvWindow;
            nOrder.quantity = options.quantity;
            nOrder.icebergQty = options.iceburgQty;
            nOrder.newClientOrderId = options.newClientOrderId;
            nOrder.newOrderRespType = options.newOrderRespType || 'FULL';
            order = new NewOrder_1.NewOrder(nOrder);
            return await self._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
    async marketSell(options) {
        let self = this;
        let order;
        let nOrder = {};
        try {
            nOrder.recvWindow = options.recvWindow;
            nOrder.type = 'MARKET';
            nOrder.side = 'SELL';
            nOrder.quantity = options.quantity;
            nOrder.symbol = options.symbol;
            nOrder.recvWindow = options.recvWindow;
            nOrder.quantity = options.quantity;
            nOrder.icebergQty = options.iceburgQty;
            nOrder.newClientOrderId = options.newClientOrderId;
            nOrder.newOrderRespType = options.newOrderRespType || 'FULL';
            order = new NewOrder_1.NewOrder(nOrder);
            return await self._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map