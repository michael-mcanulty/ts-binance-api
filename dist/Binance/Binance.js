"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BotWebsocket_1 = require("../Websocket/BotWebsocket");
const Rest_1 = require("../Rest/Rest");
class Binance {
    constructor(options) {
        Binance.options = options;
    }
    get rest() {
        if (this._rest) {
            return this._rest;
        }
        else {
            this._rest = new Rest_1.Rest(Binance.options);
            return this._rest;
        }
    }
    get websocket() {
        if (this._websocket) {
            return this._websocket;
        }
        else {
            this._websocket = new BotWebsocket_1.BotWebsocket(Binance.options);
            return this._websocket;
        }
    }
}
Binance.INTERVALS = ['1m', '3m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w'];
Binance.candleAPILimits = {
    '1m': 1000,
    '3m': 1000,
    '5m': 1000,
    '15m': 1000,
    '30m': 1000,
    '1h': 1000,
    '2h': 744,
    '4h': 373,
    '6h': 248,
    '8h': 187,
    '12h': 187,
    '1d': 63,
    '3d': 21,
    '1w': 9,
};
Binance.intervalDays = {
    '1m': 6,
    '3m': 3,
    '5m': 8,
    '15m': 20,
    '30m': 30,
    '1h': 55,
    '2h': 100,
    '4h': 200,
    '6h': 350,
    '8h': 400,
    '12h': 500,
    '1d': 1000,
    '3d': 333,
    '1w': 56
};
Binance.intervalToMilliseconds = {
    '1m': 60000,
    '3m': 60000 * 3,
    '5m': 60000 * 5,
    '15m': 60000 * 15,
    '30m': 60000 * 30,
    '1h': 3600000,
    '2h': 3600000 * 2,
    '4h': 3600000 * 4,
    '6h': 3600000 * 6,
    '8h': 3600000 * 8,
    '12h': 3600000 * 12,
    '1d': 3600000 * 24,
    '3d': 3600000 * 24 * 3,
    '1w': 3600000 * 24 * 7
};
Binance.intervalToMinutes = {
    '1m': 1,
    '3m': 3,
    '5m': 5,
    '15m': 15,
    '30m': 30,
    '1h': 60,
    '2h': 60 * 2,
    '4h': 60 * 4,
    '6h': 60 * 6,
    '8h': 60 * 8,
    '12h': 60 * 12,
    '1d': 60 * 24,
    '3d': 60 * 24 * 3,
    '1w': 60 * 24 * 7,
    '1M': 2.628e+9
};
Binance.millisecondsToInterval = {
    60000: '1m',
    180000: '3m',
    300000: '5m',
    900000: '15m',
    1800000: '30m',
    3600000: '1h',
    7200000: '2h',
    14400000: '4h',
    21600000: '6h',
    28800000: '8h',
    43200000: '12h',
    86400000: '1d',
    259200000: '3d',
    604800000: '1w'
};
Binance.minutesToInterval = {
    1: '1m',
    3: '3m',
    5: '5m',
    15: '15m',
    30: '30m',
    60: '1h',
    120: '2h',
    240: '4h',
    360: '6h',
    480: '8h',
    720: '12h',
    1440: '1d',
    4320: '3d',
    10080: '1w'
};
exports.Binance = Binance;
//# sourceMappingURL=Binance.js.map