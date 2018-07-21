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
const Binance_1 = require("./Binance/Binance");
class Bot {
    constructor(opts) {
        Binance_1.Binance.options = opts;
        Bot.binance = new Binance_1.Binance(opts);
    }
}
exports.Bot = Bot;
let opts = {};
opts.auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
opts.auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = opts.auth;
opts.test = false;
opts.useServerTime = true;
const bot = new Bot(opts);
Bot.binance.init().then((markets) => __awaiter(this, void 0, void 0, function* () {
    try {
        let buyStorm = yield Bot.binance.rest.limitBuy("STORMBTC", 550, 0.00000155, 5000);
        console.log(buyStorm);
    }
    catch (err) {
        console.log(err);
    }
}));
//# sourceMappingURL=Bot.js.map