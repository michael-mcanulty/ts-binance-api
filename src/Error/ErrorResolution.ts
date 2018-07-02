export class ErrorResolution {
	public static all: ErrorResolution[] = <ErrorResolution[]>[{
		"name": "shutdown",
		"sendEmail": true,
		"retry": false,
		"timeout": 0,
		codes: [-1102, -2015, -2014, -1002, -1121, -1116, -1115, -1117, -2008]
	}, {
		"name": "doNothing",
		"sendEmail": false,
		"retry": true,
		"timeout": 0,
		codes: [-1127, -1006, -1015, -1014, -1013, -1101, -1003, -1106, 1104]
	}, {
		"name": "retry",
		"sendEmail": false,
		"retry": true,
		"timeout": 10000,
		codes: [-1021, -1125, -2012]
	}, {
		"name": "restart",
		"sendEmail": false,
		"retry": false,
		"timeout": 0,
		codes: [-1002, -1016, -1000, -1007, -1006]
	}];
	codes: number[];
	name: string;
	retry: boolean;
	sendEmail: boolean;
	timeout: number;
}