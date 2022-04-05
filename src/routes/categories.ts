import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import { models } from '../db'

const router: Router = Router();

const {
	Category,
	Product,
} = models;

export default () => {
	// List all categories
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
		const categories = await Category.findAll({
			include: [{ model: Product, as: 'products' }],
		});

		return res.status(200).json({
			data: categories,
			message: req.isSk ? 'Zoznam všetkých kategorií' : 'List of all categories',
		});
	});

	// One category
	router.get('/:categoryId', async (req: Request, res: Response, _next: NextFunction) => {
		const { categoryId } = req.params;

		// Check if categoryId is valid number
		if (isNaN(Number(categoryId))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? (
					'Parameter categoryId musí byť číslo!'
				) : (
					'Parameter categoryId must be number!'
				),
			});
		}

		const categories = await Category.findByPk(categoryId, {
			include: [{ model: Product, as: 'products' }],
		});

		return res.status(200).json({
			data: categories,
			message: req.isSk ? 'Categória' : 'One category',
		});
	});

	return router;
}