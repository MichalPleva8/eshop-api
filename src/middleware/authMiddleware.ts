import {
	Request,
	Response,
	NextFunction,
} from 'express';
import { verify } from 'jsonwebtoken';

/* eslint no-shadow: "off" */
declare module 'express' {
	export interface Request {
		user?: any;
	}
	export interface Response {
		user?: any;
	}
}

/* eslint consistent-return: "off" */
const authProtect = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	// Check if user has authorized
	if (!authHeader) {
		return res.status(401).json({
			data: {},
			message: req.isSk ? 'Nieste AuthorizovanÃ½!' : 'Not Authorized!',
		});
	}

	const token = authHeader.split(' ')[1];
	verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
		if (err) {
			return res.status(403).json({
				data: {},
				message: req.isSk ? 'NeplatnÃ½ token!' : 'Invalid token!',
			});
		}

		req.user = user;
		next();
	});
};

export default authProtect;
