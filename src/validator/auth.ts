import { body } from 'express-validator';

function checkAuth() {
	return [
		body('email')
			.notEmpty()
			.withMessage('email can not be empty!')
			.isEmail()
			.withMessage('email must be valid email!'),

		body('password')
			.notEmpty()
			.withMessage('password can not be empty!')
			.isString()
			.withMessage('password must be valid string!'),
	];
}

export { checkAuth };
