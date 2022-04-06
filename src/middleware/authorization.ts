import {
	Request,
	Response,
	NextFunction
} from 'express';
import { verify } from 'jsonwebtoken';

declare module 'express' {
	export interface Request {
		user?: any;
	}
	export interface Response {
		user?: any;
	}
}

const authorization = (req: Request, res: Response, next: NextFunction) => {
	const authHeader = req.headers.authorization;

	// Check if user has authorized
	if (!authHeader) {
		return res.status(401).json({
			data: {},
			message: req.isSk ? 'Nieste Authorizovaný!' : 'Not Authorized!',
		});
	}

	const token = authHeader.split(" ")[1];
	verify(token, process.env.TOKEN_SECRET as string, (err: any, user: any) => {
		if (err) {
			return res.status(403).json({
				data: {},
				message: req.isSk ? 'Neplatný token!' : 'Invalid token!',
			});
		}

		req.user = user
		next();
	});
}

export default authorization;