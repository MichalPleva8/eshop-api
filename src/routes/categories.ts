import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import { models } from '../db';

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
		if (Number.isNaN(Number(categoryId))) {
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

	// Add category
	router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
		const { name } = req.body;

		// Validation
		if (!name) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím vyplňte všetky polia!' : 'Please fill out all fields!',
			});
		}

		// Check if name is string
		if (typeof name !== 'string') {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Price musí byť číslo!' : 'Price must be a number!',
			});
		}

		// Check if is unique
		const categories = Category.findOne({ where: { name } })
			.catch((err: any) => console.error(err));

		if (categories.length > 0) {
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
	});

	// Delete category
	router.delete('/:id', async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.params;

		// Check if id is not empty
		if (!id) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím zadajte id!' : 'Please enter id!',
			});
		}

		const affected = Category.destroy({ where: { id } })
			.catch((err: any) => console.error(err));

		// Check if row was deleted
		if (affected <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadny produkt nebol vymazaný!' : 'No product was deleted!',
			});
		}

		return res.status(200).json({
			data: {},
			message: req.isSk ? 'Produkt bol vymazaný!' : 'Product was deleted!',
		});
	});

	return router;
};
