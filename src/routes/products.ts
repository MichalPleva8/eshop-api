import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import { Op } from 'sequelize';
import { models } from '../db';

const router: Router = Router();

const {
	Product,
} = models;

export default () => {
	// List all products
	router.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const {
			limit,
			page,
			categoryID,
			search,
		} = req.query;

		// Check if categoryID is valid number
		if (categoryID && Number.isNaN(Number(categoryID))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'programID musí byť platné číslo' : 'programID must be a valid number',
			});
		}

		// Check if limit & page are valid numbers
		if (typeof limit === 'string' && typeof page === 'string' && (Number.isNaN(Number(limit)) || Number.isNaN(Number(page)))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'limit & page musí byť platné číslo' : 'limit & page must be a valid number',
			});
		}

		// Check if page is 0
		if (typeof page === 'string' && !Number.isNaN(Number(page)) && Number(page) === 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Neplatná hodnota page' : 'Invalid page value',
			});
		}

		// Search Validation
		if (typeof search === 'string' && search.length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Search je prázdy!' : 'Search is empty!',
			});
		}

		// Search is string
		if (typeof search !== 'undefined' && !Number.isNaN(Number(search))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Search musí byť platný text!' : 'Search must be type string!',
			});
		}

		const filter: any = {};
		if (categoryID) filter.programID = categoryID;
		if (search) {
			filter.name = {
				[Op.iLike]: `%${search}%`,
			};
		}

		try {
			const products = await Product.findAll({
				limit: limit ? Number(limit) : 10, // Default limit 10
				offset: page ? Number(page) - 1 : 0, // Default page 1
				where: filter,
			});

			return res.status(200).json({
				data: products,
				message: req.isSk ? 'Zoznam všetkých produktov' : 'List of all products',
			});
		} catch (error) {
			return next(error);
		}
	});

	// List one product
	router.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
		const { productId } = req.params;

		try {
			const product = await Product.findByPk(productId);

			return res.status(200).json({
				data: product,
				message: req.isSk ? 'Zoznam jedného produktu' : 'List of one product',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Add product
	router.post('/', async (req: Request, res: Response, next: NextFunction) => {
		const { name, price, categoryID } = req.body;

		// Validation
		if (!(name && price && categoryID)) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím vyplňte všetky polia!' : 'Please fill out all fields!',
			});
		}

		// Check if price is number
		if (typeof price !== 'number') {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Price musí byť číslo!' : 'Price must be a number!',
			});
		}

		try {
			// Check if is unique
			const products = Product.findOne({ where: { name } });

			if (products.length > 0) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Produkt už existuje!' : 'Product already exists!',
				});
			}

			const affected = await Product.build({ name, price, categoryID });
			await affected.save();

			return res.status(201).json({
				data: affected,
				message: req.isSk ? 'Produkt bol pridaný!' : 'Product has been added!',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Update product
	router.patch('/:id', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		// Check if id is not empty
		if (!id) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím zadajte id' : 'Please enter id!',
			});
		}

		// Check if body is not empty
		if (Object.keys(req.body).length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadne hodnoty neboli zadané!' : 'No values were entered!',
			});
		}

		try {
			const affected = await Product.update(req.body, {
				where: { id },
			});

			// I ended here
			if (affected <= 0) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Žiadny produkt nebol upravený!' : 'No product was updated!',
				});
			}

			return res.status(200).json({
				data: {},
				message: req.isSk ? 'Produkt bol upravený!' : 'Product was updated!',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Delete product
	router.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;

		// Check if id is not empty
		if (!id) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím zadajte id!' : 'Please enter id!',
			});
		}

		try {
			const affected = Product.destroy({ where: { id } });

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
		} catch (error) {
			return next(error);
		}
	});

	return router;
};
