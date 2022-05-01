import {
	Request,
	Response,
	NextFunction,
} from 'express';

import { models, sequelize } from '../db';
import { USER_ROLES } from '../utils/enums';

const {
	Order,
	OrderDetail,
	User,
	Product,
} = models;

const getOrders = async (req: Request, res: Response, next: NextFunction) => {
	const { id, role } = req.user;

	try {
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
		});

		return res.status(200).json({
			data: orders,
			message: req.isSk ? 'Zoznam všetkých objednávok' : 'List of all orders',
		});
	} catch (error) {
		return next(error);
	}
};

const getOneOrder = async (req: Request, res: Response, next: NextFunction) => {
	const { id, role } = req.user;
	const { orderId } = req.params;

	try {
		const orders = await Order.findOne({
			where: role === USER_ROLES.ADMIN ? { id: orderId } : {
				id: orderId,
				OrderUserID: id,
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

		// Check if order was found
		if (!orders) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Objednávka s týmto id neexistuje!' : 'Order with this id does not exist!',
			});
		}

		return res.status(200).json({
			data: orders,
			message: req.isSk ? 'Vaša Objednávka' : 'Your Order',
		});
	} catch (error) {
		return next(error);
	}
};

const createOrder = async (req: Request, res: Response, next: NextFunction) => {
	const { id, email } = req.user;
	const { address, phone, products } = req.body;

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

		await OrderDetail.bulkCreate(items);

		await transaction.commit();

		return res.status(201).json({
			data: {},
			message: req.isSk ? 'Objednávka bol pridaná!' : 'Order has been added!',
		});
	} catch (error) {
		await transaction.rollback();
		return next(error);
	}
};

const deleteOrder = async (req: Request, res: Response, next: NextFunction) => {
	const { id } = req.user;
	const { orderId } = req.params;

	const transaction = await sequelize.transaction();

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

		await transaction.commit();

		return res.status(200).json({
			data: {},
			message: req.isSk ? 'Objednávka bola vymazaná!' : 'Order was deleted!',
		});
	} catch (error) {
		await transaction.rollback();
		return next(error);
	}
};

export {
	getOrders,
	getOneOrder,
	createOrder,
	deleteOrder,
};
