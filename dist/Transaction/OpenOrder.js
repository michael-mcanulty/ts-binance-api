"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BaseOrder_1 = require("./BaseOrder");
const EOrderEnums_1 = require("./Interfaces/EOrderEnums");
class OpenOrder extends BaseOrder_1.BaseOrder {
    constructor(clientOrderId, executedQty, orderId, origQty, price, side, status, symbol, timeInForce, type, icebergQty, isWorking, stopPrice, time) {
        super(price, side, symbol, timeInForce, type);
        this.icebergQty = parseFloat(icebergQty);
        this.isWorking = isWorking;
        this.stopPrice = parseFloat(stopPrice);
        this.symbol = symbol;
        this.time = time;
    }
    static cancelOrderById(orderId) {
        let boolRes = false;
        let allOrderIds;
        let removeIdx;
        if (OpenOrder.allOpenOrders.length > 0) {
            allOrderIds = OpenOrder.allOpenOrders.map(order => order.orderId);
            removeIdx = allOrderIds.indexOf(orderId);
            if (removeIdx >= 0) {
                OpenOrder.allOpenOrders.splice(removeIdx, 1);
                boolRes = true;
            }
        }
        return boolRes;
    }
    static binanceFormat(openOrder) {
        let binance = {};
        binance.clientOrderId = openOrder.clientOrderId;
        binance.executedQty = openOrder.executedQty.toString();
        binance.icebergQty = openOrder.icebergQty.toString();
        binance.isWorking = openOrder.isWorking;
        binance.orderId = openOrder.orderId;
        binance.origQty = openOrder.origQty.toString();
        binance.price = openOrder.price.toString();
        binance.side = EOrderEnums_1.EOrderSide[openOrder.side];
        binance.status = EOrderEnums_1.EOrderStatus[openOrder.status];
        binance.stopPrice = openOrder.stopPrice.toString();
        binance.symbol = openOrder.symbol;
        binance.timeInForce = EOrderEnums_1.ETimeInForce[openOrder.timeInForce];
        binance.time = openOrder.time;
        binance.type = EOrderEnums_1.EOrderType[openOrder.type];
        return binance;
    }
    static cancelOrdersBySymbol(symbol) {
        let boolResArr = [];
        let res = false;
        let cancelIds;
        if (OpenOrder.allOpenOrders.length > 0) {
            cancelIds = OpenOrder.allOpenOrders.filter(o => o.symbol === symbol).map(o => o.orderId);
            if (cancelIds.length > 0) {
                cancelIds.forEach(id => {
                    boolResArr.push(OpenOrder.cancelOrderById(id));
                });
                res = boolResArr.every(b => b === true);
            }
        }
        return res;
    }
}
OpenOrder.allOpenOrders = [];
exports.OpenOrder = OpenOrder;
//# sourceMappingURL=OpenOrder.js.map