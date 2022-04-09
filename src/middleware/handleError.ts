import {
	Request,
	Response,
	NextFunction,
} from 'express';

import { appendFileSync } from 'fs';

export default function handleError(error: any, req: Request, res: Response, next: NextFunction) {
	console.error(error.stack);

	const now = new Date().toLocaleString();
	appendFileSync('errorlog.txt', `[${now}] - Server has crashed because: ${error.stack}\n`);

	res.status(500).json({
		data: {},
		message: 'Something went wrong with the server!',
	});

	next();
}
