import {
	Request,
	Response,
	NextFunction,
} from 'express';

import { appendFileSync } from 'fs';

export default function handleError(error: any, req: Request, res: Response, next: NextFunction) {
	console.error(error.stack);

	const now = new Date().toLocaleString();
	appendFileSync('errorlog.txt', `[${now}] - ${error.message}\n`);

	const statusCode = error.status || 500;
	res.status(statusCode).json({
		data: {},
		message: 'Something went wrong with the server!',
	});

	return next();
}
