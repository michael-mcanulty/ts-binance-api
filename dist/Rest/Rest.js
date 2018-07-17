"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const BotHttp_1 = require("./BotHttp");
const EMethod_1 = require("./EMethod");
const CandleInterval_1 = require("../ExchangeInfo/CandleInterval");
const Candle_1 = require("../ExchangeInfo/Candle");
const Market_1 = require("../Market/Market");
const Binance_1 = require("../Binance/Binance");
const Index_1 = require("../Index");
const NewOrder_1 = require("../Transaction/NewOrder");
const EOrderEnums_1 = require("../Transaction/Interfaces/EOrderEnums");
const Order_1 = require("../Transaction/Order");
const HttpError_1 = require("../Error/HttpError");
const QueryCancelOrder_1 = require("../Transaction/QueryCancelOrder");
const Signed_1 = require("./Signed");
const DataStream_1 = require("./DataStream");
const CallOptions_1 = require("./CallOptions");
const OpenOrder_1 = require("../Transaction/OpenOrder");
const QueryOrder_1 = require("../Transaction/QueryOrder");
class Rest extends BotHttp_1.BotHttp {
    _cancelOrder(cancelOrder) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let orderRes;
                let privateOrder;
                let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, false);
                privateOrder = yield this.privateCall(url, callOpts, cancelOrder);
                if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
                    resolve(privateOrder);
                }
                else {
                    if (privateOrder instanceof HttpError_1.HttpError) {
                        reject(privateOrder);
                    }
                    else {
                        orderRes = privateOrder;
                        resolve(orderRes);
                    }
                }
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    _getCandlesInterval(symbol, interval, limit) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let candleOpts = {};
                candleOpts.symbol = symbol;
                candleOpts.interval = interval;
                candleOpts.limit = limit;
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET);
                let raw = yield this.call('/v1/klines', callOpts, candleOpts);
                let candles = Candle_1.Candle.fromHttpByInterval(raw, candleOpts.symbol, candleOpts.interval);
                candles.forEach((candle) => {
                    candle.quoteAsset = Index_1.Bot.binance.rest.getQuoteAssetName(symbol);
                });
                resolve(candles);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    ;
    _newOrder(order) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let orderRes;
                let privateOrder;
                let url = (Binance_1.Binance.options.test) ? "/v3/order/test" : "/v3/order";
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, false, false);
                privateOrder = yield this.privateCall(url, callOpts, order);
                if (this.options.test && (Object.keys(privateOrder).length === 0 && privateOrder.constructor === Object)) {
                    resolve(privateOrder);
                }
                else {
                    if (privateOrder instanceof HttpError_1.HttpError) {
                        reject(privateOrder);
                    }
                    else {
											let order = privateOrder;
											orderRes = new Order_1.Order(order.symbol, order.price, order.side, order.executedQty, order.orderId, order.origQty, order.status, order.timeInForce, order.type, order.clientOrderId, order.transactTime);
                        resolve(orderRes);
                    }
                }
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    cancelOrder(symbol, orderId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cancelOrder = new QueryCancelOrder_1.QueryCancelOrder(symbol, orderId);
                if (cancelOrder && cancelOrder.hasOwnProperty("symbol")) {
                    OpenOrder_1.OpenOrder.cancelOrderById(orderId);
                }
                let cancelResult = this._cancelOrder(cancelOrder);
                resolve(cancelResult);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    cancelOrdersBySymbol(symbol) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let cancelOrder = new QueryCancelOrder_1.QueryCancelOrder(symbol);
                if (cancelOrder && cancelOrder.hasOwnProperty("symbol")) {
                    OpenOrder_1.OpenOrder.cancelOrdersBySymbol(symbol);
                }
                let cancelResult = this._cancelOrder(cancelOrder);
                resolve(cancelResult);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    closeDataStream() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.DELETE, true, false, true);
                let dStream = new DataStream_1.DataStream(Rest.listenKey);
                result = yield this.privateCall('/v1/userDataStream', callOpts, dStream);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    getCandles(symbols, intervals, limit) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let candleIntervals = [];
                for (let symbol of symbols) {
                    for (let interval of intervals) {
                        let candles = yield this._getCandlesInterval(symbol, interval, limit);
                        let ci = new CandleInterval_1.CandleInterval(candles);
                        candleIntervals.push(ci);
                    }
                }
                resolve(candleIntervals);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    ;
    getMarkets(quoteAsset) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let info = yield this.getExchangeInfo();
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
        }));
    }
    getDataStream() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.POST, true, true, false);
                let signed = new Signed_1.Signed();
                Rest.listenKey = (yield this.privateCall('/v1/userDataStream', callOpts, signed));
                resolve(Rest.listenKey);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    getExchangeInfo() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, true, false, this.options.auth.key);
                let info = yield this.call('/v1/exchangeInfo', callOpts);
                resolve(info);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    ;
    getOpenOrders(symbol, orderId, recvWindow, origClientOrderId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let url = "/v3/openOrders";
                let nOpen = new QueryOrder_1.QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
                let iOpenOrders = yield this.privateCall(url, callOpts, nOpen);
                let openOrders = iOpenOrders.map(o => {
                    return new OpenOrder_1.OpenOrder(o.clientOrderId, o.executedQty, o.orderId, o.origQty, o.price, o.side, o.status, o.symbol, o.timeInForce, o.type, o.icebergQty, o.isWorking, o.stopPrice, o.time);
                });
                resolve(openOrders);
                resolve();
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    getQuoteAssetName(symbol) {
        let qa;
        let marketFilter = Binance_1.Binance.markets.filter(market => market.symbol === symbol);
        let market;
        if (marketFilter && marketFilter.length > 0) {
            market = marketFilter[0];
            qa = market.quoteAsset;
        }
        return qa;
    }
    getOrder(symbol, orderId, recvWindow, origClientOrderId) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let query = new QueryOrder_1.QueryOrder(symbol, orderId, recvWindow, origClientOrderId);
                let url = '/v3/order';
							let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.GET, true, false, false);
							let privateCall = yield this.privateCall(url, callOpts, query);
							let result;
							if (privateCall && privateCall.hasOwnProperty("symbol")) {
								result = new Order_1.Order(privateCall.symbol, privateCall.price, privateCall.side, privateCall.executedQty, privateCall.orderId, privateCall.origQty, privateCall.status, privateCall.timeInForce, privateCall.type, privateCall.clientOrderId, privateCall.time);
							}
							resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    keepDataStream() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let result;
            try {
                let callOpts = new CallOptions_1.CallOptions(EMethod_1.EMethod.PUT, true, false, true);
                let dStream = new DataStream_1.DataStream(Rest.listenKey);
                result = yield this.privateCall('/v1/userDataStream', callOpts, dStream);
                resolve(result);
            }
            catch (err) {
                reject(err);
            }
        }));
    }

	limitBuy(symbol, quantity, price, recvWindow, iceburgQty, timeInForce, stopPrice, newClientOrderId, newOrderRespType) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let type = EOrderEnums_1.EOrderType.LIMIT;
                let side = EOrderEnums_1.EOrderSide.BUY;
							let order = new NewOrder_1.NewOrder(symbol, quantity, EOrderEnums_1.EOrderSide[side], EOrderEnums_1.EOrderType[type], price.toString(), iceburgQty.toString(), EOrderEnums_1.ETimeInForce[timeInForce], stopPrice.toString(), recvWindow, newClientOrderId, EOrderEnums_1.ENewOrderRespType[newOrderRespType]);
                let orderRes = yield this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        }));
    }

	limitSell(symbol, quantity, price, recvWindow, iceburgQty, timeInForce, stopPrice, newClientOrderId, newOrderRespType) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let type = EOrderEnums_1.EOrderType.LIMIT;
                let side = EOrderEnums_1.EOrderSide.SELL;
							let order = new NewOrder_1.NewOrder(symbol, quantity, EOrderEnums_1.EOrderSide[side], EOrderEnums_1.EOrderType[type], price.toString(), iceburgQty.toString(), EOrderEnums_1.ETimeInForce[timeInForce], stopPrice.toString(), recvWindow, newClientOrderId, EOrderEnums_1.ENewOrderRespType[newOrderRespType]);
							let orderRes = yield this._newOrder(order);
							resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        }));
    }

	marketBuy(symbol, quantity, recvWindow) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let type = EOrderEnums_1.EOrderType.MARKET;
                let side = EOrderEnums_1.EOrderSide.BUY;
							let order = new NewOrder_1.NewOrder(symbol, quantity, EOrderEnums_1.EOrderSide[side], EOrderEnums_1.EOrderType[type], null, null, null, null, recvWindow, null, null);
                let orderRes = yield this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        }));
    }

	marketSell(symbol, quantity, recvWindow) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                let type = EOrderEnums_1.EOrderType.MARKET;
                let side = EOrderEnums_1.EOrderSide.SELL;
							let order = new NewOrder_1.NewOrder(symbol, quantity, EOrderEnums_1.EOrderSide[side], EOrderEnums_1.EOrderType[type], null, null, null, null, recvWindow, null, null);
                let orderRes = yield this._newOrder(order);
                resolve(orderRes);
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    constructor(options) {
        super(options);
    }
}
exports.Rest = Rest;
//# sourceMappingURL=Rest.js.map