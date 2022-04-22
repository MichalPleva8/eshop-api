import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { OrderModel } from './order';
import { ProductModel } from './product';

export class OrderDetailModel extends DatabaseModel {
	id: number;

	DetailQuantity: number;

	DetailPrice: number;

	products: ProductModel;

	orders: OrderModel;
}

export default (sequelize: Sequelize) => {
	OrderDetailModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		DetailQuantity: {
			type: DataTypes.INTEGER,
		},
		DetailPrice: {
			type: DataTypes.FLOAT,
		},
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'orderdetails',
	});

	OrderDetailModel.associate = (models) => {
		(OrderDetailModel as any).belongsTo(models.Product, {
			foreignKey: {
				name: 'DetailProductID',
				allowNull: false,
			},
		});

		(OrderDetailModel as any).belongsTo(models.Order, {
			foreignKey: {
				name: 'DetailOrderID',
				allowNull: false,
			},
		});
	};

	return OrderDetailModel;
};
