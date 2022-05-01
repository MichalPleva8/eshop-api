import {
	Request,
	Response,
	NextFunction,
} from 'express';
import { validationResult } from 'express-validator';

function handleValidationError(req: Request, res: Response, next: NextFunction) {
	const error = validationResult(req);
	if (!error.isEmpty()) {
		return res.status(400).json({
			data: {},
			message: error.array()[0].msg,
		});
	}

	return next();
}

export default handleValidationError;
