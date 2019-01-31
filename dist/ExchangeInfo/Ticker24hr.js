"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Ticker24hr {
    constructor(ticker) {
        this.askPrice = parseFloat(ticker.askPrice);
        this.bidPrice = parseFloat(ticker.bidPrice);
        this.closeTime = ticker.closeTime;
        this.count = ticker.count;
        this.firstId = ticker.firstId;
        this.highPrice = parseFloat(ticker.highPrice);
        this.lastId = ticker.lastId;
        this.lastPrice = parseFloat(ticker.lastPrice);
        this.lastQty = parseFloat(ticker.lastQty);
        this.lowPrice = parseFloat(ticker.lowPrice);
        this.openPrice = parseFloat(ticker.openPrice);
        this.openTime = ticker.openTime;
        this.prevClosePrice = parseFloat(ticker.prevClosePrice);
        this.priceChange = parseFloat(ticker.priceChange);
        this.priceChangePercent = parseFloat(ticker.priceChangePercent);
        this.quoteVolume = parseFloat(ticker.quoteVolume);
        this.symbol = ticker.symbol;
        this.volume = parseFloat(ticker.volume);
        this.weightedAvgPrice = parseFloat(ticker.weightedAvgPrice);
    }
}
exports.Ticker24hr = Ticker24hr;
//# sourceMappingURL=Ticker24hr.js.map