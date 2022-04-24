import { body, param } from 'express-validator';

function checkOneUser() {
	return [
		param('userId')
			.notEmpty()
			.withMessage('Id param should not be empty!')
			.isInt()
			.withMessage('Id must be a valid number!'),
	];
}

function checkUserUpdate() {
	return [
		body('name')
			.isEmpty()
			.withMessage('Please enter name!')
			.isString()
			.withMessage('name must be valid string!'),

		body('surname')
			.isEmpty()
			.withMessage('Please enter surname!')
			.isString()
			.withMessage('surname must be valid string!'),

		body('nickName')
			.isEmpty()
			.withMessage('Please enter nickName!')
			.isString()
			.withMessage('nickName must be valid string!'),

		body('age')
			.isEmpty()
			.withMessage('Please enter age!')
			.isInt()
			.withMessage('age must be valid number!'),

		body('tel')
			.isEmpty()
			.withMessage('Please enter tel!')
			.isString()
			.withMessage('tel must be valid string!'),
	];
}

export { checkOneUser, checkUserUpdate };
