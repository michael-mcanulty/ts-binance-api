export class ApiHeader {
	'X-MBX-APIKEY': string;

	constructor(key: string) {
		this['X-MBX-APIKEY'] = key;
	}
}