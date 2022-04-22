import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import { models, sequelize } from '../db';
import { USER_ROLES } from '../utils/enums';

const router: Router = Router();

const {
	Order,
	OrderDetail,
	Category,
	User,
	Product,
} = models;

/**
 * This endpoint handles orders and shoping cart
 */
export default () => {
	// List all orders / all user orders
	router.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const { id, role } = req.user;

		const orders = await Order.findAll({
			where: role === USER_ROLES.ADMIN ? undefined : { OrderUserID: id },
			include: [
				{
					model: OrderDetail,
					as: 'orderdetails',
					include: [{ model: Product }],
				},
				{
					model: User,
					as: 'user',
				},
			],
		})
		.catch((error: any) => {
			console.error(error);
			next(error);
		});

		return res.status(200).json({
			data: orders,
			message: req.isSk ? 'Zoznam všetkých objednávok' : 'List of all orders',
		});
	});

	// One order
	router.get('/:orderId', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.user;
		const { orderId } = req.params;

		// Check if categoryId is valid number
		if (Number.isNaN(Number(orderId))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? (
					'Parameter orderId musí byť číslo!'
				) : (
					'Parameter orderId must be number!'
				),
			});
		}

		try {
			const orders = await Order.findOne({
				where: {
					id,
					OrderUserID: orderId,
				},
				include: [
					{
						model: OrderDetail,
						as: 'orderdetails',
						include: [{ model: Product }],
					},
					{
						model: User,
						as: 'user',
					},
				],
			});

			return res.status(200).json({
				data: orders,
				message: req.isSk ? 'Objednávka' : 'Order',
			});
		} catch (error) {
			return next(error);
		}
	});

	// Add items to cart
	router.post('/', async (req: Request, res: Response, next: NextFunction) => {
		const { id, email } = req.user;
		const { address, phone, products } = req.body;

		// Check if address and phone is empty
		if (!(address || phone)) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prázde pole (address, phone)!' : 'Empty fields (address, phone)!',
			});
		}

		// Check if products is empty
		if (products.length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadne hodnoty neboli zadané!' : 'No values were entered!',
			});
		}

		const transaction = await sequelize.transaction();

		try {
			const order = await Order.create({
				OrderShipAmount: 100.0,
				OrderShipAdress: address,
				OrderPhone: phone,
				OrderEmail: email,
				OrderUserID: id,
			});

			/* eslint arrow-body-style: "off" */
			const items = await products.map((product: any) => {
				return {
					DetailQuantity: product.quantity,
					DetailPrice: 100.00,
					DetailProductID: product.productId,
					DetailOrderID: order.id,
				};
			});

			const details = await OrderDetail.bulkCreate(items);

			await transaction.commit();

			return res.status(201).json({
				data: {},
				message: req.isSk ? 'Objednávka bol pridaná!' : 'Order has been added!',
			});
		} catch (error) {
			await transaction.rollback();
			return next(error);
		}
	});

	// Delete category
	router.delete('/:orderId', async (req: Request, res: Response, next: NextFunction) => {
		const { id, email } = req.user;
		const { orderId } = req.params;

		// Check if id is not empty
		if (!orderId) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím zadajte id!' : 'Please enter id!',
			});
		}

		const t = await sequelize.transaction();

		try {
			const affected = await Order.destroy({ where: { id: orderId, OrderUserID: id } });

			await OrderDetail.destroy({ where: { DetailOrderID: orderId } });

			// Check if row was deleted
			if (affected <= 0) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Objednávka nebola vymazaná!' : 'Order was not deleted!',
				});
			}

			await t.commit();

			return res.status(200).json({
				data: {},
				message: req.isSk ? 'Objednávka bola vymazaná!' : 'Order was deleted!',
			});
		} catch (error) {
			await t.rollback();
			return next(error);
		}
	});

	return router;
};
