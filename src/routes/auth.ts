import { Router } from 'express';

import { checkAuth } from '../validator/auth';
import handleValidationError from '../middleware/handleValidationError';
import { register, login } from '../controllers/auth.controller';

const router: Router = Router();

export default () => {
	// Resiters a new user
	router.post(
		'/register',
		checkAuth(),
		handleValidationError,
		register,
	);

	// Log in user
	router.post(
		'/login',
		checkAuth(),
		handleValidationError,
		login,
	);

	return router;
};
