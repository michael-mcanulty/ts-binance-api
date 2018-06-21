export interface HttpError extends Error {
	code: number | string;
	message: string;
}