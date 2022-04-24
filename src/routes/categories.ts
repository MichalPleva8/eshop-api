import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import { models } from '../db';
import handleValidationError from '../middleware/handleValidationError';
import { checkCreateCategory, checkOneCategory } from '../validator/categories';

const router: Router = Router();

const {
	Category,
	Product,
} = models;

export default () => {
	// List all categories
	router.get('/', async (req: Request, res: Response, next: NextFunction) => {
		try {
			const categories = await Category.findAll({
				include: [{ model: Product, as: 'products' }],
			});

			return res.status(200).json({
				data: categories,
				message: req.isSk ? 'Zoznam všetkých kategorií' : 'List of all categories',
			});
		} catch (error) {
			return next(error);
		}
	});

	// One category
	router.get('/:categoryId', checkOneCategory(), handleValidationError, async (req: Request, res: Response, next: NextFunction) => {
		const { categoryId } = req.params;

		try {
			const categories = await Category.findByPk(categoryId, {
				include: [{ model: Product, as: 'products' }],
			});

			return res.status(200).json({
				data: categories,
				message: req.isSk ? 'Categória' : 'One category',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Add category
	router.post('/', checkCreateCategory(), handleValidationError, async (req: Request, res: Response, next: NextFunction) => {
		const { name } = req.body;

		try {
			// Check if is unique
			const category = await Category.findOne({ where: { name } });

			if (category) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Categória už existuje!' : 'Category already exists!',
				});
			}

			const affected = await Category.build({ name });
			await affected.save();

			return res.status(201).json({
				data: affected,
				message: req.isSk ? 'Produkt bol pridaný!' : 'Product has been added!',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Delete category
	router.delete('/:categoryId', checkOneCategory(), handleValidationError, async (req: Request, res: Response, next: NextFunction) => {
		const { categoryId } = req.params;

		try {
			const affected = await Category.destroy({ where: { id: categoryId } });

			// Check if row was deleted
			if (!affected) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Žiadny produkt nebol vymazaný!' : 'No product was deleted!',
				});
			}

			return res.status(200).json({
				data: {},
				message: req.isSk ? 'Produkt bol vymazaný!' : 'Product was deleted!',
			});
		} catch (error) {
			return next(error);
		}
	});

	return router;
};
