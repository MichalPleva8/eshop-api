import { param, body } from 'express-validator';

function checkOneOrder() {
	return [
		param('orderId')
			.notEmpty()
			.withMessage('Id param should not be empty!')
			.isInt()
			.withMessage('Id must be a valid number!'),
	];
}

function checkCreateOrder() {
	return [
		body('address')
			.notEmpty()
			.withMessage('address should not be empty!')
			.isString()
			.withMessage('address should be valid string!'),

		body('phone')
			.notEmpty()
			.withMessage('phone should not be empty!')
			.isString()
			.withMessage('phone should be valid string!'),

		body('products')
			.notEmpty()
			.withMessage('products should not be empty!')
			.isArray()
			.withMessage('products should be valid array!'),
	];
}

export { checkOneOrder, checkCreateOrder };
