"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TickerVolume {
    static toTickerVolume(tickers) {
        return tickers.map(ticker => new TickerVolume(ticker));
    }
    constructor(ticker) {
        this.symbol = ticker.symbol;
        this.volume = parseFloat(ticker.volume);
    }
}
exports.TickerVolume = TickerVolume;
//# sourceMappingURL=TickerVolume.js.map