import {HttpErrorHandler} from "./HttpErrorHandler";
import {EErrorType} from "./Email/Enums/EErrorType";
import {EMethod} from "../Rest/EMethod";

let allErrors = [
		{"message":"UNKNOWN","code":-1000, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"DISCONNECTED","code":-1001, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNAUTHORIZED","code":-1002, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"TOO_MANY_REQUESTS","code":-1003, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNEXPECTED_RESP","code":-1006, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"TIMEOUT","code":-1007, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"INVALID_MESSAGE","code":-1013, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNKNOWN_ORDER_COMPOSITION","code":-1014, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"TOO_MANY_ORDERS","code":-1015, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"SERVICE_SHUTTING_DOWN","code":-1016, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNSUPPORTED_OPERATION","code":-1020, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"INVALID_TIMESTAMP","code":-1021, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"INVALID_SIGNATURE","code":-1022, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"ILLEGAL_CHARS","code":-1100, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"TOO_MANY_PARAMETERS","code":-1101, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"MANDATORY_PARAM_EMPTY_OR_MALFORMED","code":-1102, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNKNOWN_PARAM","code":-1103, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"UNREAD_PARAMETERS","code":-1104, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"PARAM_EMPTY","code":-1105, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"PARAM_NOT_REQUIRED","code":-1106, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"INVALID_PARAMETER","code":-1130, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"BAD_API_ID","code":-2008, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"DUPLICATE_API_KEY_DESC","code":-2009, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"INSUFFICIENT_BALANCE","code":-2010, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"CANCEL_ALL_FAIL","code":-2012, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"NO_SUCH_ORDER","code":-2013, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"BAD_API_KEY_FMT","code":-2014, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )},
		{"message":"REJECTED_MBX_KEY","code":-2015, handler: new HttpErrorHandler(this.code,"http://localhost", 4001, EErrorType.Binance, EMethod.GET, false )}];
export default allErrors;