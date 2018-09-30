"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotHttp_1 = require("./BotHttp");
const EMethod_1 = require("./EMethod");
const CandleInterval_1 = require("../ExchangeInfo/CandleInterval");
const Candle_1 = require("../ExchangeInfo/Candle");
const Market_1 = require("../Market/Market");
const Binance_1 = require("../Binance/Binance");
const NewOrder_1 = require("../Transaction/NewOrder");
const EOrderEnums_1 = require("../Transaction/Interfaces/EOrderEnums");
const Order_1 = require("../Transaction/Order");
const HttpError_1 = require("../Error/HttpError");
const CancelOrder_1 = require("../Transaction/CancelOrder");
const Signed_1 = require("./Signed");
const DataStream_1 = require("./DataStream");
const CallOptions_1 = require("./CallOptions");
const OpenOrder_1 = require("../Transaction/OpenOrder");
const QueryOrder_1 = require("../Transaction/QueryOrder");
const AllOrders_1 = require("../Transaction/AllOrders");
const OutboundAccountInfo_1 = require("../Account/OutboundAccountInfo");
const AccountInfoOptions_1 = require("../Account/AccountInfoOptions");
const CancelOrderResponse_1 = require("../Transaction/CancelOrderResponse");
const TestOrder_1 = require("../Transaction/TestOrder");
const __1 = require("..");
class Rest extends BotHttp_1.BotHttp {
    _cancelOrder(cancelOrder) {
        return new Promise(async (resolve, reject) => {
            try {
                let orderResRaw;
                let response;
                let privateOrder;
                let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, false);
                privateOrder = await this.privateCall(url, callOpts, cancelOrder);
                if (privateOrder instanceof HttpError_1.HttpError) {
                    reject(privateOrder);
                }
                else {
                    orderResRaw = privateOrder;
                    response = new CancelOrderResponse_1.CancelOrderResponse(orderResRaw);
                    resolve(response);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    _getCandlesInterval(symbol, interval, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                let candleOpts = {};
                candleOpts.symbol = symbol;
                candleOpts.interval = interval;
                candleOpts.limit = limit;
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET);
                let raw = await this.call('/v1/klines', callOpts, candleOpts);
                let candles = Candle_1.Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
                candles.forEach((candle) => {
                    candle.quoteAsset = Rest.getQuoteAssetName(symbol);
                });
                resolve(candles);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    ;
    _newOrder(order) {
        return new Promise(async (resolve, reject) => {
            try {
                let orderRes;
                let privateOrder;
                let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, false, false);
                privateOrder = await this.privateCall(url, callOpts, NewOrder_1.NewOrder.toBinance(order));
                if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
                    resolve(new TestOrder_1.TestOrder());
                }
                else {
                    if (privateOrder instanceof HttpError_1.HttpError) {
                        reject(privateOrder);
                    }
                    else {
                        let order = privateOrder;
                        orderRes = new Order_1.Order(order);
                        resolve(orderRes);
                    }
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    cancelOrder(symbol, orderId) {
        return new Promise(async (resolve, reject) => {
            try {
                let result;
                let cancelOrder = new CancelOrder_1.CancelOrder(symbol, orderId);
                let cancelResult = await this._cancelOrder(cancelOrder);
                result = new CancelOrderResponse_1.CancelOrderResponse(cancelResult);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    cancelOrdersBySymbol(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let results = [];
                let config = {};
                config.symbol = options.symbol;
                let openOrders = await this.getOpenOrders(config);
                let symbolOrders = openOrders.filter(order => order.symbol === config.symbol);
                for (let order of symbolOrders) {
                    let cancelResp = await this.cancelOrder(order.symbol, order.orderId);
                    results.push(cancelResp);
                }
                resolve(results);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    closeDataStream() {
        return new Promise(async (resolve, reject) => {
            let result;
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, true);
                let dStream = new DataStream_1.DataStream(Rest.listenKey);
                result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getAccountInfo(recvWindow) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = "/v3/account";
                let opts = new AccountInfoOptions_1.AccountInfoOptions(recvWindow);
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let accountInfoRest = await this.privateCall(url, callOpts, opts);
                let info = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceRest(accountInfoRest);
                resolve(info);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getAllOrders(symbol, limit = 500, orderId, recvWindow) {
        return new Promise(async (resolve, reject) => {
            try {
                let query = new AllOrders_1.AllOrders(symbol, orderId, limit, recvWindow);
                let url = '/v3/allOrders';
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let privateCall = await this.privateCall(url, callOpts, query);
                let results = [];
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
                resolve(results);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getAvailableTotalBalance(quoteAsset, dollarBaseAsset = "USDT", primaryBaseAsset = "BTC") {
        return new Promise(async (resolve, reject) => {
            try {
                let balances = await this.getBalances();
                let prices = await this.getPrices();
                if (balances.length === 0) {
                    reject("Error: Balances not working");
                }
                const QA = quoteAsset;
                const USDT = dollarBaseAsset;
                const FA = "BNB";
                const BTC = primaryBaseAsset;
                let balVals = [];
                let result = {};
                balances.forEach((bal) => {
                    let avail = {};
                    let BA = bal.asset;
                    let available = bal.available;
                    let symbol;
                    if (BA !== BTC && BTC !== QA) {
                        symbol = BA + BTC;
                        let exchangeValue = __1.Price.GetPriceValue(prices, symbol);
                        avail.quoteAsset = quoteAsset;
                        let totalBTCVal = available * exchangeValue;
                        avail.totalVal = totalBTCVal * __1.Price.GetPriceValue(prices, BTC + USDT);
                        balVals.push(avail);
                    }
                    else {
                        if (BA === BTC && BTC !== QA) {
                            symbol = BA + QA;
                            avail.quoteAsset = quoteAsset;
                            avail.totalVal = available * __1.Price.GetPriceValue(prices, BTC + USDT);
                            balVals.push(avail);
                        }
                        else if (BTC === QA && BA !== BTC) {
                            symbol = BA + QA;
                            let exchangeValue = __1.Price.GetPriceValue(prices, symbol);
                            avail.quoteAsset = quoteAsset;
                            avail.totalVal = available * exchangeValue;
                            balVals.push(avail);
                        }
                        else if (BTC === QA && BA === BTC) {
                            symbol = BA + QA;
                            avail.quoteAsset = quoteAsset;
                            avail.totalVal = available;
                            balVals.push(avail);
                        }
                    }
                });
                result.totalVal = balVals.reduce((prev, cur) => {
                    return prev + cur.totalVal;
                }, 0);
                result.quoteAsset = quoteAsset;
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getBalances(recvWindow, gtZeroOnly = false) {
        return new Promise(async (resolve, reject) => {
            try {
                let balances;
                let accountInfo = await this.getAccountInfo(recvWindow);
                balances = accountInfo.balances;
                if (gtZeroOnly) {
                    balances = accountInfo.balances.filter(bal => bal.available > 0);
                }
                else {
                    balances = accountInfo.balances;
                }
                resolve(balances);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getCandles(symbols, intervals, limit) {
        return new Promise(async (resolve, reject) => {
            try {
                let candleIntervals = [];
                for (let symbol of symbols) {
                    for (let interval of intervals) {
                        let candles = await this._getCandlesInterval(symbol, interval, limit);
                        let ci = new CandleInterval_1.CandleInterval(candles);
                        candleIntervals.push(ci);
                    }
                }
                resolve(candleIntervals);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    ;
    getDataStream() {
        return new Promise(async (resolve, reject) => {
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, true, false);
                let signed = new Signed_1.Signed();
                Rest.listenKey = await this.privateCall('/v1/userDataStream', callOpts, signed);
                resolve(Rest.listenKey);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getDepositAddress(request) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = '/wapi/v3/depositAddress.html';
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let depositAddress = await this.privateCall(url, callOpts, request);
                resolve(depositAddress);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getDepositHisory(request) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = '/wapi/v3/depositHistory.html';
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let depositHistory = await this.privateCall(url, callOpts, request);
                resolve(depositHistory);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getExchangeInfo() {
        return new Promise(async (resolve, reject) => {
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
                let info = await this.call('/v1/exchangeInfo', callOpts);
                resolve(info);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    ;
    getMarkets(quoteAsset) {
        return new Promise(async (resolve, reject) => {
            try {
                let info = await this.getExchangeInfo();
                let symbols = info.symbols;
                let markets = symbols.map(symbol => {
                    return new Market_1.Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market_1.Market.GetLimitsFromBinanceSymbol(symbol));
                });
                Binance_1.Binance.markets = markets;
                resolve(markets);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getOpenOrders(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = "/v3/openOrders";
                let opts = {};
                opts.symbol = options.symbol;
                opts.recvWindow = options.recvWindow;
                opts.orderId = options.orderId;
                opts.origClientOrderId = options.origClientOrderId;
                let query = new QueryOrder_1.QueryOrder(opts);
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let privateCall = await this.privateCall(url, callOpts, query);
                let openOrders = [];
                if (Array.isArray(privateCall) && privateCall.length > 0) {
                    openOrders = privateCall.map((o) => {
                        return new OpenOrder_1.OpenOrder(o);
                    });
                }
                resolve(openOrders);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getOrder(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let opts = {};
                opts.symbol = options.symbol;
                opts.recvWindow = options.recvWindow;
                opts.orderId = options.orderId;
                opts.origClientOrderId = options.origClientOrderId;
                let query = new QueryOrder_1.QueryOrder(opts);
                let url = '/v3/order';
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let privateCall = await this.privateCall(url, callOpts, query);
                let result;
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
                }
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    getPrices() {
        return new Promise(async (resolve, reject) => {
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
            let url = '/v1/ticker/allPrices';
            try {
                let rawPrices = await this.call(url, callOpts);
                if (Array.isArray(rawPrices) && rawPrices.length > 0) {
                    let prices = __1.Price.toPrices(rawPrices);
                    resolve(prices);
                }
            }
            catch (err) {
                reject(err);
            }
        });
    }
    static getQuoteAssetName(symbol) {
        let qa;
        let marketFilter = Binance_1.Binance.markets.filter(market => market.symbol === symbol);
        let market;
        if (marketFilter && marketFilter.length > 0) {
            market = marketFilter[0];
            qa = market.quoteAsset;
        }
        return qa;
    }
    getStatus() {
        return new Promise(async (resolve, reject) => {
            try {
                let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
                let status = await this.call('/wapi/v3/systemStatus.html', opts);
                resolve(status);
            }
            catch (err) {
                reject(`Error retrieving the system status. Message: ${err}`);
            }
        });
    }
    getWithdrawHisory(request) {
        return new Promise(async (resolve, reject) => {
            try {
                let url = '/wapi/v3/withdrawHistory.html';
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let withdrawHistory = await this.privateCall(url, callOpts, request);
                resolve(withdrawHistory);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    keepDataStream() {
        return new Promise(async (resolve, reject) => {
            let result;
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.PUT, true, false, true);
                let dStream = new DataStream_1.DataStream(Rest.listenKey);
                result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    limitBuy(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let order;
                let orderRes;
                let nOrder = {};
                const TYPE = EOrderEnums_1.EOrderType.LIMIT;
                const SIDE = EOrderEnums_1.EOrderSide.BUY;
                const RESPONSE_TYPE = EOrderEnums_1.ENewOrderRespType.FULL;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = EOrderEnums_1.EOrderType[TYPE];
                nOrder.side = EOrderEnums_1.EOrderSide[SIDE];
                nOrder.quantity = options.quantity;
                nOrder.stopPrice = options.stopPrice;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = EOrderEnums_1.ENewOrderRespType[options.newOrderRespType] || EOrderEnums_1.ENewOrderRespType[RESPONSE_TYPE];
                order = new NewOrder_1.NewOrder(nOrder);
                orderRes = await this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    limitSell(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let order;
                let orderRes;
                let nOrder = {};
                const TYPE = EOrderEnums_1.EOrderType.LIMIT;
                const SIDE = EOrderEnums_1.EOrderSide.SELL;
                const RESPONSE_TYPE = EOrderEnums_1.ENewOrderRespType.FULL;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = EOrderEnums_1.EOrderType[TYPE];
                nOrder.side = EOrderEnums_1.EOrderSide[SIDE];
                nOrder.quantity = options.quantity;
                nOrder.stopPrice = options.stopPrice;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = EOrderEnums_1.ENewOrderRespType[options.newOrderRespType] || EOrderEnums_1.ENewOrderRespType[RESPONSE_TYPE];
                order = new NewOrder_1.NewOrder(nOrder);
                orderRes = await this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    marketBuy(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let order;
                let orderRes;
                let nOrder = {};
                const TYPE = EOrderEnums_1.EOrderType.MARKET;
                const SIDE = EOrderEnums_1.EOrderSide.BUY;
                const RESPONSE_TYPE = EOrderEnums_1.ENewOrderRespType.FULL;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = EOrderEnums_1.EOrderType[TYPE];
                nOrder.side = EOrderEnums_1.EOrderSide[SIDE];
                nOrder.quantity = options.quantity;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = EOrderEnums_1.ENewOrderRespType[options.newOrderRespType] || EOrderEnums_1.ENewOrderRespType[RESPONSE_TYPE];
                order = new NewOrder_1.NewOrder(nOrder);
                orderRes = await this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    marketSell(options) {
        return new Promise(async (resolve, reject) => {
            try {
                let order;
                let orderRes;
                let nOrder = {};
                const TYPE = EOrderEnums_1.EOrderType.MARKET;
                const SIDE = EOrderEnums_1.EOrderSide.SELL;
                const RESPONSE_TYPE = EOrderEnums_1.ENewOrderRespType.FULL;
                nOrder.recvWindow = options.recvWindow;
                nOrder.type = EOrderEnums_1.EOrderType[TYPE];
                nOrder.side = EOrderEnums_1.EOrderSide[SIDE];
                nOrder.quantity = options.quantity;
                nOrder.icebergQty = options.iceburgQty;
                nOrder.newClientOrderId = options.newClientOrderId;
                nOrder.newOrderRespType = EOrderEnums_1.ENewOrderRespType[options.newOrderRespType] || EOrderEnums_1.ENewOrderRespType[RESPONSE_TYPE];
                order = new NewOrder_1.NewOrder(nOrder);
                orderRes = await this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        });
    }
    constructor(options) {
        super(options);
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map