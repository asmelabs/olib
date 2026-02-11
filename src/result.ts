export type Result<T> =
	| { data: T; error: null }
	| { data: null; error: OLibError };

export type OLibErrorCode =
	| "NOT_FOUND"
	| "RATE_LIMITED"
	| "PARSE_ERROR"
	| "NETWORK_ERROR"
	| "SERVER_ERROR";

export interface OLibError {
	code: OLibErrorCode;
	message: string;
	status?: number;
	cause?: unknown;
}

export function ok<T>(data: T): Result<T> {
	return { data, error: null };
}

export function err<T>(error: OLibError): Result<T> {
	return { data: null, error };
}
