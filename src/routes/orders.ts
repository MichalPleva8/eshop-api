import { Router } from 'express';

import handleValidationError from '../middleware/handleValidationError';
import { checkCreateOrder, checkOneOrder } from '../validator/orders';
import {
	createOrder,
	deleteOrder,
	getOneOrder,
	getOrders,
} from '../controllers/orders.controller';

const router: Router = Router();

export default () => {
	// List all orders / all user orders
	router.get('/', getOrders);

	// One order
	router.get(
		'/:orderId',
		checkOneOrder(),
		handleValidationError,
		getOneOrder,
	);

	// Add items to cart
	router.post(
		'/',
		checkCreateOrder(),
		handleValidationError,
		createOrder,
	);

	// Delete category
	router.delete(
		'/:orderId',
		checkOneOrder(),
		handleValidationError,
		deleteOrder,
	);

	return router;
};
