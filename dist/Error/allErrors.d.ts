import { HttpErrorHandler } from "./HttpErrorHandler";
declare let allErrors: {
    "message": string;
    "code": number;
    handler: HttpErrorHandler;
}[];
export default allErrors;
