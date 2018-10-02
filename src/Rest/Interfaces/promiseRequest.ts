import * as request from "request";
import {RequiredUriUrl, RequestAPI} from "request";

interface RequestPromise extends request.Request {
	then: Promise<any>["then"];
	catch: Promise<any>["catch"];
	promise(): Promise<any>;
}

interface RequestPromiseOptions extends request.CoreOptions {
	simple?: boolean;
	transform?(body: any, response: request.Response, resolveWithFullResponse?: boolean): any;
	transform2xxOnly?: boolean;
	resolveWithFullResponse?: boolean;
}

type Options = OptionsWithUri | OptionsWithUrl;
type OptionsWithUri = request.UriOptions & RequestPromiseOptions;
type OptionsWithUrl = request.UrlOptions & RequestPromiseOptions;

declare var requestPromise: RequestAPI<RequestPromise, RequestPromiseOptions, RequiredUriUrl>;

