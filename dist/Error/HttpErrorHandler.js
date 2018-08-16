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
const EMethod_1 = require("../Rest/EMethod");
const BotHttp_1 = require("../Rest/BotHttp");
const NodeMailer_1 = require("./Email/NodeMailer");
const EErrorType_1 = require("./Email/Enums/EErrorType");
class HttpErrorHandler {
    constructor(code, endpoint, port, type, method, sendEmail, emailAddress, emailOptions) {
        this.code = code;
        this.type = EErrorType_1.EErrorType[type];
        this.port = port || null;
        this.method = EMethod_1.EMethod[method];
        this.emailAddress = emailAddress || null;
        this.sendEmail = sendEmail || false;
        this.endpoint = endpoint;
        this.url = `${this.endpoint}:${this.port}`;
    }
    handleError(error) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            if (this.port !== null && this.method !== null) {
                let url = this.url;
                let reqOpts = {};
                reqOpts.method = EMethod_1.EMethod[this.method];
                reqOpts.headers = new Headers();
                if (this.payload && this.payload.length > 0) {
                    url = BotHttp_1.BotHttp.buildUrl(this.url, false, this.payload);
                }
                if (this.sendEmail && this.emailOptions) {
                    HttpErrorHandler.emailService = new NodeMailer_1.NodeMailer(this.emailOptions);
                    let msgOptions = {};
                    msgOptions.from = this.emailAddress;
                    msgOptions.to = this.emailAddress;
                    let message = (this.type === EErrorType_1.EErrorType[EErrorType_1.EErrorType.Binance]) ? error['msg'] : error['message'];
                    msgOptions.subject = `A new ${EErrorType_1.EErrorType[this.type] || "Unknown"} error has been received | ${message}`;
                    msgOptions.text = `${new Date().toLocaleDateString()} : \n Code: ${error.code} \n Message: ${message}`;
                    try {
                        yield HttpErrorHandler.emailService.sendEmail(msgOptions);
                    }
                    catch (err) {
                        reject(err);
                    }
                }
                try {
                    let fetch = {};
                    resolve(fetch);
                }
                catch (err) {
                    reject(err);
                }
            }
        }));
    }
}
HttpErrorHandler.allErrors = [
    {
        "message": "UNKNOWN",
        "code": -1000,
        handler: new HttpErrorHandler(-1000, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "DISCONNECTED",
        "code": -1001,
        handler: new HttpErrorHandler(-1001, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNAUTHORIZED",
        "code": -1002,
        handler: new HttpErrorHandler(-1002, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "TOO_MANY_REQUESTS",
        "code": -1003,
        handler: new HttpErrorHandler(-1003, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNEXPECTED_RESP",
        "code": -1006,
        handler: new HttpErrorHandler(-1006, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "TIMEOUT",
        "code": -1007,
        handler: new HttpErrorHandler(-1007, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "INVALID_MESSAGE",
        "code": -1013,
        handler: new HttpErrorHandler(-1013, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNKNOWN_ORDER_COMPOSITION",
        "code": -1014,
        handler: new HttpErrorHandler(1014, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "TOO_MANY_ORDERS",
        "code": -1015,
        handler: new HttpErrorHandler(-1015, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "SERVICE_SHUTTING_DOWN",
        "code": -1016,
        handler: new HttpErrorHandler(-1016, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNSUPPORTED_OPERATION",
        "code": -1020,
        handler: new HttpErrorHandler(-1020, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "INVALID_TIMESTAMP",
        "code": -1021,
        handler: new HttpErrorHandler(-1021, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "INVALID_SIGNATURE",
        "code": -1022,
        handler: new HttpErrorHandler(-1022, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "ILLEGAL_CHARS",
        "code": -1100,
        handler: new HttpErrorHandler(-1100, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "TOO_MANY_PARAMETERS",
        "code": -1101,
        handler: new HttpErrorHandler(-1101, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "MANDATORY_PARAM_EMPTY_OR_MALFORMED",
        "code": -1102,
        handler: new HttpErrorHandler(-1102, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNKNOWN_PARAM",
        "code": -1103,
        handler: new HttpErrorHandler(-1103, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "UNREAD_PARAMETERS",
        "code": -1104,
        handler: new HttpErrorHandler(-1104, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "PARAM_EMPTY",
        "code": -1105,
        handler: new HttpErrorHandler(-1105, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "PARAM_NOT_REQUIRED",
        "code": -1106,
        handler: new HttpErrorHandler(-1106, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "INVALID_PARAMETER",
        "code": -1130,
        handler: new HttpErrorHandler(-1130, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "BAD_API_ID",
        "code": -2008,
        handler: new HttpErrorHandler(-2008, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "DUPLICATE_API_KEY_DESC",
        "code": -2009,
        handler: new HttpErrorHandler(-2009, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "INSUFFICIENT_BALANCE",
        "code": -2010,
        handler: new HttpErrorHandler(-2010, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "CANCEL_ALL_FAIL",
        "code": -2012,
        handler: new HttpErrorHandler(-2012, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "NO_SUCH_ORDER",
        "code": -2013,
        handler: new HttpErrorHandler(-2013, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "BAD_API_KEY_FMT",
        "code": -2014,
        handler: new HttpErrorHandler(-2014, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    },
    {
        "message": "REJECTED_MBX_KEY",
        "code": -2015,
        handler: new HttpErrorHandler(-2015, "http://localhost", 4001, EErrorType_1.EErrorType.Binance, EMethod_1.EMethod.GET, false)
    }
];
exports.HttpErrorHandler = HttpErrorHandler;
//# sourceMappingURL=HttpErrorHandler.js.map