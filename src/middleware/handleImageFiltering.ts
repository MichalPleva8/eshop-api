// File type validator
import {
	Request,
} from 'express';

/* eslint no-shadow: "off" */
declare module 'express' {
	export interface Request {
		fileError?: any;
	}
	export interface Reponse {
		fileError?: any;
	}
}

export default function handleImageFiltering(req: Request, file: any, cb: any) {
	try {
		// Accept images only
		if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
			req.fileError = true;
			return cb(null, false);
		}

		req.fileError = false;
		return cb(null, true);
	} catch (error) {
		return cb();
	}
}
