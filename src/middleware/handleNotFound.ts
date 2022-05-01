import {
	Request,
	Response,
	NextFunction,
} from 'express';

/* eslint no-unused-vars: "off" */
const handleNotFound = (req: Request, res: Response, _next: NextFunction) => (
	res.status(404).json({
		data: {},
		message: req.isSk ? 'Nanašla sa žiadna odpoveď pre túto url!' : 'There is nothing on this url!',
	})
);

export default handleNotFound;
