import { param, body } from 'express-validator';

function checkOneProduct() {
	return [
		param('productId')
			.notEmpty()
			.withMessage('id param should not be empty!')
			.isInt()
			.withMessage('id must be a valid number!'),
	];
}

function checkCreateProduct() {
	return [
		body('name')
			.notEmpty()
			.withMessage('name should not be empty!')
			.isString()
			.withMessage('name should be valid string!'),

		body('price')
			.notEmpty()
			.withMessage('price should not be empty!')
			.isInt()
			.withMessage('price should be valid string!'),

		body('categoryID')
			.notEmpty()
			.withMessage('categoryID should not be empty!'),
	];
}

function checkUpdateProduct() {
	return [
		param('productId')
			.notEmpty()
			.withMessage('id param should not be empty!')
			.isInt()
			.withMessage('id must be a valid number!'),

		body('name')
			.notEmpty()
			.withMessage('name should not be empty!')
			.isString()
			.withMessage('name should be valid string!'),

		body('price')
			.notEmpty()
			.withMessage('price should not be empty!')
			.isInt()
			.withMessage('price should be valid string!'),

		body('categoryID')
			.notEmpty()
			.withMessage('categoryID should not be empty!'),
	];
}

export { checkOneProduct, checkCreateProduct, checkUpdateProduct };
