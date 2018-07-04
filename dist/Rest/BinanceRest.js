"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
	return new (P || (P = Promise))(function (resolve, reject) {
		function fulfilled(value) {
			try {
				step(generator.next(value));
			} catch (e) {
				reject(e);
			}
		}

		function rejected(value) {
			try {
				step(generator["throw"](value));
			} catch (e) {
				reject(e);
			}
		}

		function step(result) {
			result.done ? resolve(result.value) : new P(function (resolve) {
				resolve(result.value);
			}).then(fulfilled, rejected);
		}

		step((generator = generator.apply(thisArg, _arguments || [])).next());
	});
};
var __rest = (this && this.__rest) || function (s, e) {
	var t = {};
	for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
		t[p] = s[p];
	if (s != null && typeof Object.getOwnPropertySymbols === "function")
		for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
			t[p[i]] = s[p[i]];
	return t;
};
Object.defineProperty(exports, "__esModule", {value: true});
const BBRest_1 = require("./BBRest");
const EMethod_1 = require("./EMethod");
const OutboundAccountInfo_1 = require("../Account/OutboundAccountInfo");
class BinanceRest extends BBRest_1.BBRest {
	constructor(options) {
		super(options);
		this.userEventHandler = cb => msg => {
			let json = JSON.parse(msg.data);
			let infoRaw = json;
			const {e: type} = json, rest = __rest(json, ["e"]);
			let accountInfo = new OutboundAccountInfo_1.OutboundAccountInfo(infoRaw);
			cb(accountInfo[type] ? accountInfo[type](rest) : Object.assign({type}, rest));
		};
	}

	closeDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.DELETE;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = yield this._call('/v1/userDataStream', this.listenKey, callOpts);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	getDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			try {
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.POST;
				callOpts.noData = true;
				this.listenKey = (yield this._call('/v1/userDataStream', null, callOpts));
				resolve(this.listenKey);
			}
			catch (err) {
				reject(err);
			}
		}));
	}

	keepDataStream() {
		return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
			let result;
			try {
				let callOpts = {};
				callOpts.method = EMethod_1.EMethod.PUT;
				callOpts.noData = false;
				callOpts.noExtra = true;
				result = yield this._call('/v1/userDataStream', this.listenKey, callOpts);
				resolve(result);
			}
			catch (err) {
				reject(err);
			}
		}));
	}
}
exports.BinanceRest = BinanceRest;
//# sourceMappingURL=BinanceRest.js.map