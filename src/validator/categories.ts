import { param, body } from 'express-validator';

function checkOneCategory() {
	return [
		param('categoryId')
			.notEmpty()
			.withMessage('categoryId param should not be empty!')
			.isInt()
			.withMessage('categoryId param must be a valid number!'),
	];
}

function checkCreateCategory() {
	return [
		body('name')
			.notEmpty()
			.withMessage('name should not be empty!')
			.isString()
			.withMessage('name should be valid string!'),
	];
}

export { checkOneCategory, checkCreateCategory };
