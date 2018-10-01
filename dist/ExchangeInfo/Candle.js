"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Candle {
    static fromHttpByInterval(rawData, symbol, interval, quoteAssetName) {
        return rawData.map(candle => {
            return new Candle(candle[0], candle[1], candle[2], candle[3], candle[4], candle[5], symbol, interval, quoteAssetName);
        });
    }
    static fromStream(rawKlineResponse, quoteAssetName) {
        let rawKline = rawKlineResponse.k;
        return new Candle(rawKline.T, rawKline.o, rawKline.h, rawKline.l, rawKline.c, rawKline.v, rawKline.s, rawKline.i, quoteAssetName);
    }
    constructor(date, open, high, low, close, volume, symbol, interval, quoteAssetName) {
        this.date = new Date(new Date(date).setSeconds(0, 0));
        this.open = parseFloat(open);
        this.high = parseFloat(high);
        this.low = parseFloat(low);
        this.close = parseFloat(close);
        this.volume = parseFloat(volume);
        if (symbol || interval || quoteAssetName) {
            this.symbol = symbol;
            this.interval = interval;
            this.quoteAsset = quoteAssetName;
        }
    }
}
exports.Candle = Candle;
//# sourceMappingURL=Candle.js.map