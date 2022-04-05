import {
	Router,
	Request,
	Response,
	NextFunction
} from 'express'
import { models } from '../db';

const router: Router = Router();

const {
	Product,
} = models;

export default () => {
	// List all products
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
		let products = await Product.findAll()
			.catch((err: any) => console.error(err));

		return res.status(200).json({
			data: products,
			message: req.isSk ? 'Zoznam všetkých produktov' : 'List of all products',
		});
	});

	// List one product
	router.get('/:productId', async (req: Request, res: Response, _next: NextFunction) => {
		let { productId } = req.params;

		let product = await Product.findByPk(productId)
			.catch((err: any) => console.error(err));

		return res.status(200).json({
			data: product,
			message: req.isSk ? 'Zoznam jedného produktu' : 'List of one product',
		});
	});

	// Add product
	router.post('/', async (req: Request, res: Response, _next: NextFunction) => {
		let { name, price, categoryID } = req.body;

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

		// Check if is unique
		let products = Product.findOne({ where: { name }})
			.catch((err: any) => console.error(err));

		if (products.length > 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Produkt už existuje!' : 'Product already exists!',
			});
		} 

		let affected = await Product.build({ name, price, categoryID });
		await affected.save();

		return res.status(201).json({
			data: affected,
			message: req.isSk ? 'Produkt bol pridaný!' : 'Product has been added!',
		});
	});

	// Update product
	router.patch('/:id', async (req: Request, res: Response, _next: NextFunction) => {
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

		let affected = await Product.update(req.body, {
			where: { id }
		}).catch((error: any) => console.error(error));

		// I ended here
		if (affected <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadny produkt nebol upravený!' : 'No product was updated!',
			});
		}

		res.status(200).json({
			data: {},
			message: req.isSk ? 'Produkt bol upravený!' : 'Product was updated!',
		});
	});

	// Delete product
	router.delete('/:id', async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.params;

		// Check if id is not empty
		if (!id) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím zadajte id!' : 'Please enter id!',
			});
		}

		let affected = Product.destroy({ where: { id }})
			.catch((err: any) => console.error(err));

		// Check if row was deleted
		if (affected <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadny produkt nebol vymazaný!' : 'No product was deleted!',
			});
		}

		res.status(200).json({
			data: {},
			message: req.isSk ? 'Produkt bol vymazaný!' : 'Product was deleted!',
		});
	});

	return router;
}