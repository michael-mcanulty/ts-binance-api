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
    async _cancelOrder(cancelOrder) {
        try {
            let orderResRaw;
            let response;
            let privateOrder;
            let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, false);
            privateOrder = await this.privateCall(url, callOpts, cancelOrder);
            if (privateOrder instanceof HttpError_1.HttpError) {
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
    async _getCandlesInterval(symbol, interval, limit) {
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
            return candles;
        }
        catch (err) {
            throw err;
        }
    }
    ;
    async _newOrder(order) {
        try {
            let orderRes;
            let privateOrder;
            let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, false, false);
            privateOrder = await this.privateCall(url, callOpts, NewOrder_1.NewOrder.toBinance(order));
            if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
                return Promise.reject(new TestOrder_1.TestOrder());
            }
            else {
                if (privateOrder instanceof HttpError_1.HttpError) {
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
            if (cancelResult) {
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
        try {
            let cancelResp;
            let results = [];
            let config = {};
            config.symbol = options.symbol;
            config.origClientOrderId = options.origClientOrderId;
            config.orderId = options.orderId;
            config.recvWindow = options.recvWindow;
            let openOrders = await this.getOpenOrders(config);
            let symbolOrders = openOrders.filter(order => order.symbol === config.symbol);
            for (let order of symbolOrders) {
                let cOpts = {};
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
        try {
            let result;
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, true);
            let dStream = new DataStream_1.DataStream(Rest.listenKey);
            result = await this.privateCall('/v1/userDataStream', callOpts, dStream);
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async getAccountInfo(recvWindow) {
        try {
            let url = "/v3/account";
            let opts = new AccountInfoOptions_1.AccountInfoOptions(recvWindow);
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            let accountInfoRest = await this.privateCall(url, callOpts, opts);
            let info = OutboundAccountInfo_1.OutboundAccountInfo.fromBinanceRest(accountInfoRest);
            return info;
        }
        catch (err) {
            throw err;
        }
    }
    async getAllOrders(options) {
        try {
            let query = new AllOrders_1.AllOrders(options);
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
            return results;
        }
        catch (err) {
            throw err;
        }
    }
    async getAvailableTotalBalance(quoteAsset, dollarBaseAsset = "USDT", primaryBaseAsset = "BTC") {
        try {
            let balances = await this.getBalances();
            let prices = await this.getPrices();
            if (balances.length === 0) {
                return Promise.reject(new Error("Error: Balances not working"));
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
            return result;
        }
        catch (err) {
            throw err;
        }
    }
    async getBalances(recvWindow, gtZeroOnly = false) {
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
            return balances;
        }
        catch (err) {
            throw err;
        }
    }
    async getCandles(symbols, intervals, limit) {
        try {
            let candleIntervals = [];
            for (let symbol of symbols) {
                for (let interval of intervals) {
                    let candles = await this._getCandlesInterval(symbol, interval, limit);
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
    async getDataStream() {
        try {
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, true, false);
            let signed = new Signed_1.Signed();
            Rest.listenKey = await this.privateCall('/v1/userDataStream', callOpts, signed);
            return Rest.listenKey;
        }
        catch (err) {
            throw err;
        }
    }
    async getDepositAddress(request) {
        try {
            let url = '/wapi/v3/depositAddress.html';
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            return await this.privateCall(url, callOpts, request);
        }
        catch (err) {
            throw err;
        }
    }
    async getDepositHisory(request) {
        try {
            let url = '/wapi/v3/depositHistory.html';
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            return await this.privateCall(url, callOpts, request);
        }
        catch (err) {
            throw err;
        }
    }
    async getExchangeInfo() {
        try {
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
            return await this.call('/v1/exchangeInfo', callOpts);
        }
        catch (err) {
            throw err;
        }
    }
    ;
    async getMarkets(quoteAsset) {
        try {
            let info = await this.getExchangeInfo();
            let symbols = info.symbols;
            let markets = symbols.map(symbol => {
                return new Market_1.Market(symbol.symbol, symbol.baseAsset, symbol.quoteAsset, Market_1.Market.GetLimitsFromBinanceSymbol(symbol));
            });
            Binance_1.Binance.markets = markets;
            return markets;
        }
        catch (err) {
            throw err;
        }
    }
    async getOpenOrders(options) {
        try {
            let opts = {};
            let url = "/v3/openOrders";
            let query;
            let callOpts;
            let privateCall;
            opts.symbol = options.symbol;
            opts.recvWindow = options.recvWindow;
            opts.orderId = options.orderId;
            opts.origClientOrderId = options.origClientOrderId;
            query = new QueryOrder_1.QueryOrder(opts);
            callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            privateCall = await this.privateCall(url, callOpts, query);
            if (Array.isArray(privateCall) && privateCall.length > 0) {
                return privateCall.map((o) => {
                    return new OpenOrder_1.OpenOrder(o);
                });
            }
            else {
                return;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getOrder(options) {
        try {
            let query;
            let url = '/v3/order';
            let callOpts;
            let privateCall;
            let result;
            let opts = {};
            opts.symbol = options.symbol;
            opts.recvWindow = options.recvWindow;
            opts.orderId = options.orderId;
            opts.origClientOrderId = options.origClientOrderId;
            query = new QueryOrder_1.QueryOrder(opts);
            callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            privateCall = await this.privateCall(url, callOpts, query);
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
            else {
                return;
            }
        }
        catch (err) {
            throw err;
        }
    }
    async getPrices() {
        try {
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
            let url = '/v1/ticker/allPrices';
            let rawPrices = await this.call(url, callOpts);
            if (Array.isArray(rawPrices) && rawPrices.length > 0) {
                return __1.Price.toPrices(rawPrices);
            }
        }
        catch (err) {
            throw err;
        }
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
    async getStatus() {
        try {
            let opts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
            return await this.call('/wapi/v3/systemStatus.html', opts);
        }
        catch (err) {
            return Promise.reject(new Error(`Error retrieving the system status. Message: ${err}`));
        }
    }
    async getWithdrawHisory(request) {
        try {
            let url = '/wapi/v3/withdrawHistory.html';
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
            let withdrawHistory = await this.privateCall(url, callOpts, request);
            return withdrawHistory;
        }
        catch (err) {
            throw err;
        }
    }
    async keepDataStream() {
        try {
            let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.PUT, true, false, true);
            let dStream = new DataStream_1.DataStream(Rest.listenKey);
            return await this.privateCall('/v1/userDataStream', callOpts, dStream);
        }
        catch (err) {
            throw err;
        }
    }
    async limitBuy(options) {
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
            return await this._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
    async limitSell(options) {
        try {
            let order;
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
            return await this._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
    async marketBuy(options) {
        try {
            let order;
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
            return await this._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
    async marketSell(options) {
        try {
            let order;
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
            return await this._newOrder(order);
        }
        catch (err) {
            throw err;
        }
    }
    constructor(options) {
        super(options);
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map