import { Router } from 'express';

import { models } from '../db';
import handleValidationError from '../middleware/handleValidationError';
import {
	checkCreateProduct,
	checkOneProduct,
	checkUpdateProduct,
} from '../validator/products';
import {
	getProducts,
	getOneProduct,
	addProduct,
	updateProduct,
	deleteProduct,
} from '../controllers/productsControler';

const router: Router = Router();

export default () => {
	// List all products
	router.get('/', getProducts);

	// List one product
	router.get(
		'/:productId',
		checkOneProduct(),
		handleValidationError,
		getOneProduct,
	);

	// Add product
	router.post(
		'/',
		checkCreateProduct(),
		handleValidationError,
		addProduct,
	);

	// Update product
	router.patch(
		'/:productId',
		checkUpdateProduct(),
		handleValidationError,
		updateProduct,
	);

	// Delete product
	router.delete(
		'/:productId',
		checkOneProduct(),
		handleValidationError,
		deleteProduct,
	);

	return router;
};
