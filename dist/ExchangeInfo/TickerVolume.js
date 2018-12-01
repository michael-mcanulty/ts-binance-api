"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class TickerVolume {
    constructor(ticker) {
        this.symbol = ticker.symbol;
        this.volume = parseFloat(ticker.volume);
    }
}
exports.TickerVolume = TickerVolume;
//# sourceMappingURL=TickerVolume.js.map