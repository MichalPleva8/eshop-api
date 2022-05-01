import { Router } from 'express';

import handleValidationError from '../middleware/handleValidationError';
import {
	checkCreateCategory,
	checkOneCategory,
} from '../validator/categories';
import {
	addCategory,
	deleteCategory,
	getCategories,
	getOneCategory,
} from '../controllers/categoriesControler';

const router: Router = Router();

export default () => {
	router.get('/', getCategories);
	router.get(
		'/:categoryId',
		checkOneCategory(),
		handleValidationError,
		getOneCategory,
	);

	router.post(
		'/',
		checkCreateCategory(),
		handleValidationError,
		addCategory,
	);

	router.delete(
		'/:categoryId',
		checkOneCategory(),
		handleValidationError,
		deleteCategory,
	);

	return router;
};
