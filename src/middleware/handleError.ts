import {
	Request,
	Response,
	NextFunction
} from 'express';

import { appendFileSync } from 'fs';

export default function handleError(err: any, req: Request, res: Response, next: NextFunction) {
	console.error(err.stack);

	let now = new Date().toLocaleString();
	appendFileSync('errorlog.txt', `[${now}] - Server has crashed because: ${err.stack}\n`);

	res.status(500).json({
		data: {},
		message: 'Something went wrong with the server!',
	});

	next();
}