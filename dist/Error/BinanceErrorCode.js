"use strict";
Object.defineProperty(exports, "__esModule", {value: true});

class BinanceErrorCode {
}

BinanceErrorCode.allItems = [
	{"msg": "UNKNOWN", "code": -1000},
	{
		"msg": "DISCONNECTED",
		"code": -1001
	}, {"msg": "UNAUTHORIZED", "code": -1002}, {"msg": "TOO_MANY_REQUESTS", "code": -1003}, {
		"msg": "UNEXPECTED_RESP",
		"code": -1006
	}, {"msg": "TIMEOUT", "code": -1007}, {"msg": "INVALID_MESSAGE", "code": -1013}, {
		"msg": "UNKNOWN_ORDER_COMPOSITION",
		"code": -1014
	}, {"msg": "TOO_MANY_ORDERS", "code": -1015}, {
		"msg": "SERVICE_SHUTTING_DOWN",
		"code": -1016
	}, {"msg": "UNSUPPORTED_OPERATION", "code": -1020}, {
		"msg": "INVALID_TIMESTAMP",
		"code": -1021
	}, {"msg": "INVALID_SIGNATURE", "code": -1022}, {
		"msg": "ILLEGAL_CHARS",
		"code": -1100
	}, {"msg": "TOO_MANY_PARAMETERS", "code": -1101}, {
		"msg": "MANDATORY_PARAM_EMPTY_OR_MALFORMED",
		"code": -1102
	}, {"msg": "UNKNOWN_PARAM", "code": -1103}, {"msg": "UNREAD_PARAMETERS", "code": -1104}, {
		"msg": "PARAM_EMPTY",
		"code": -1105
	}, {
		"msg": "PARAM_NOT_REQUIRED",
		"code": -1106
	}, {"code": -1112}, {"code": -1114}, {"code": -1115}, {"code": -1116}, {"code": -1117}, {"code": -1118}, {"code": -1119}, {"code": -1120}, {"code": -1121}, {"code": -1125}, {"code": -1127}, {"code": -1128}, {
		"msg": "INVALID_PARAMETER",
		"code": -1130
	}, {"msg": "BAD_API_ID", "code": -2008}, {
		"msg": "DUPLICATE_API_KEY_DESC",
		"code": -2009
	}, {"msg": "INSUFFICIENT_BALANCE", "code": -2010}, {"msg": "CANCEL_ALL_FAIL", "code": -2012}, {
		"msg": "NO_SUCH_ORDER",
		"code": -2013
	}, {"msg": "BAD_API_KEY_FMT", "code": -2014}, {"msg": "REJECTED_MBX_KEY", "code": -2015}
];
exports.BinanceErrorCode = BinanceErrorCode;
//# sourceMappingURL=BinanceErrorCode.js.map