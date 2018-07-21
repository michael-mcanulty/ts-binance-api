"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const EOrderEnums_1 = require("../Transaction/Interfaces/EOrderEnums");
class ExecutionReport {
    static fromBinanceStream(iExecReportRaw) {
        let result = new ExecutionReport(iExecReportRaw.n, iExecReportRaw.N, iExecReportRaw.E, iExecReportRaw.e, EOrderEnums_1.EExecutionType[iExecReportRaw.x], iExecReportRaw.F, iExecReportRaw.m, iExecReportRaw.w, iExecReportRaw.l, iExecReportRaw.c, iExecReportRaw.i, iExecReportRaw.r, EOrderEnums_1.EOrderStatus[iExecReportRaw.X], iExecReportRaw.T, EOrderEnums_1.EExecutionType[iExecReportRaw.x], iExecReportRaw.C, iExecReportRaw.p, iExecReportRaw.L, iExecReportRaw.q, EOrderEnums_1.EOrderSide[iExecReportRaw.S], iExecReportRaw.P, iExecReportRaw.s, EOrderEnums_1.ETimeInForce[iExecReportRaw.f], iExecReportRaw.z, iExecReportRaw.t);
        return result;
    }
    constructor(commission, commissionAsset, eventTime, eventType, executionType, icebergQuantity, isBuyerMaker, isOrderWorking, lastTradeQuantity, newClientOrderId, orderId, orderRejectReason, orderStatus, orderTime, orderType, originalClientOrderId, price, priceLastTrade, quantity, side, stopPrice, symbol, timeInForce, totalTradeQuantity, tradeId) {
        this.commission = parseFloat(commission);
        this.commissionAsset = commissionAsset;
        this.eventTime = eventTime;
        this.eventType = eventType;
        this.executionType = EOrderEnums_1.EExecutionType[executionType];
        this.icebergQuantity = parseFloat(icebergQuantity);
        this.isBuyerMaker = isBuyerMaker;
        this.isOrderWorking = isOrderWorking;
        this.lastTradeQuantity = parseFloat(lastTradeQuantity);
        this.newClientOrderId = newClientOrderId;
        this.orderId = orderId;
        this.orderRejectReason = orderRejectReason;
        this.orderStatus = EOrderEnums_1.EOrderStatus[orderStatus];
        this.orderTime = orderTime;
        this.orderType = EOrderEnums_1.EOrderType[orderType];
        this.originalClientOrderId = originalClientOrderId;
        this.price = parseFloat(price);
        this.priceLastTrade = parseFloat(priceLastTrade);
        this.quantity = parseFloat(quantity);
        this.side = EOrderEnums_1.EOrderSide[side];
        this.stopPrice = parseFloat(stopPrice);
        this.symbol = symbol;
        this.timeInForce = EOrderEnums_1.ETimeInForce[timeInForce];
        this.totalTradeQuantity = parseFloat(totalTradeQuantity);
        this.tradeId = tradeId;
    }
}
exports.ExecutionReport = ExecutionReport;
//# sourceMappingURL=ExecutionReport.js.map