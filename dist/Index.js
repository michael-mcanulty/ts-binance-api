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
const Auth_1 = require("./Account/Auth");
const Binance_1 = require("./Binance/Binance");
class Bot {
	constructor() {
	}

	static init(options) {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				yield Bot.binance.initialize(options);
				resolve();
			}
			catch (err) {
				reject();
			}
		}));
	}
}
Bot.binance = new Binance_1.Binance();
exports.Bot = Bot;
let opts = {};
let auth = new Auth_1.Auth();
auth.key = "S05wQBtvZ8LmuAkqiDMXWKvJI1SBeR9H6kE9poWQVeA6MLGp508h7gLX0Wce92u6";
auth.secret = "iDCk1PtTyucLSlj5wRYIeSrphteLX2ESRONkcsxjhbg2PubidzGps34bKw98tm2D";
opts.auth = auth;
opts.test = true;
opts.useServerTime = true;
Bot.init(opts).then((success) => __awaiter(this, void 0, void 0, function* () {
	yield Bot.binance.websocket.balances(res => {
		console.log(res);
	});
}));
//# sourceMappingURL=Index.js.map