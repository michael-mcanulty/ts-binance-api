"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Candle_1 = require("./Candle");
class RestCandle {
    static fromRest(rawData) {
        return rawData.map(candle => {
            return new RestCandle(candle[0], candle[1], candle[2], candle[3], candle[4], candle[5], candle[6], candle[7], candle[8], candle[9], candle[10], candle[11]);
        });
    }
    toCandle(symbol, interval) {
        return new Candle_1.Candle(new Date(this.openTime), parseFloat(this.open), parseFloat(this.high), parseFloat(this.low), parseFloat(this.close), parseFloat(this.volume), new Date(this.closeTime), symbol, interval);
    }
    constructor(openTime, open, high, low, close, volume, closeTime, qaVolume, numTrades, takerBuyBAVolume, takerBuyQAVolume, ignore) {
        this.openTime = openTime;
        this.open = open;
        this.high = high;
        this.low = low;
        this.close = close;
        this.volume = volume;
        this.closeTime = closeTime;
        this.qaVolume = qaVolume;
        this.numTrades = numTrades;
        this.takerBuyBAVolume = takerBuyBAVolume;
        this.takerBuyQAVolume = takerBuyQAVolume;
        this.ignore = ignore;
    }
}
exports.RestCandle = RestCandle;
//# sourceMappingURL=RestCandle.js.map