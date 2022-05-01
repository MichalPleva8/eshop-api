import {
	Request,
	Response,
	NextFunction,
} from 'express';

/* eslint consistent-return: "off" */
function adminCheck(req: Request, res: Response, next: NextFunction) {
	if (req.user.role !== 'ADMIN') {
		return res.status(403).json({
			data: {},
			message: req.isSk ? 'Tento obsah je prístupný iba Administrátorom!' : 'You are not authorized to get this content!',
		});
	}

	next();
}

export default adminCheck;
