"use strict";
Object.defineProperty(exports, "__esModule", {value: true});
const Signed_1 = require("./Signed");
class DataStream extends Signed_1.Signed {
	constructor(listenKey) {
		super();
		this.listenKey = listenKey.listenKey;
	}
}
exports.DataStream = DataStream;
//# sourceMappingURL=DataStream.js.map