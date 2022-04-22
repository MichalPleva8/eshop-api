import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { OrderDetailModel } from './orderdetail';
import { UserModel } from './user';

export class OrderModel extends DatabaseModel {
	id: number;

	OrderShipAmount: number;

	OrderShipAdress: string;

	OrderPhone: string;

	OrderEmail: string;

	OrderDetails: OrderDetailModel[];

	OrderUser: UserModel;
}

export default (sequelize: Sequelize) => {
	OrderModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		OrderShipAmount: {
			type: DataTypes.FLOAT,
		},
		OrderShipAdress: {
			type: DataTypes.STRING(200),
		},
		OrderPhone: {
			type: DataTypes.STRING(200),
		},
		OrderEmail: {
			type: DataTypes.STRING(200),
		},
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'order',
	});

	OrderModel.associate = (models) => {
		(OrderModel as any).belongsTo(models.User, {
			foreignKey: {
				name: 'OrderUserID',
				allowNull: false,
			},
		});

		(OrderModel as any).hasMany(models.OrderDetail, {
			foreignKey: {
				name: 'DetailOrderID',
				allowNull: false,
			},
		});
	};

	return OrderModel;
};
