import {
	Request,
	Response,
	NextFunction,
} from 'express';

/* eslint no-shadow: "off" */
declare module 'express' {
	export interface Request {
		lang?: string;
		isSk?: boolean;
	}
	export interface Response {
		lang?: string;
		isSk?: boolean;
	}
}

export default function handleLocalization(req: Request, res: Response, next: NextFunction) {
	const lang = req.headers.language;

	if (lang === 'sk') {
		req.lang = 'sk';
		req.isSk = true;
	} else {
		req.lang = 'en';
		req.isSk = false;
	}

	next();
}
