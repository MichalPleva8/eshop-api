/* eslint no-unused-vars: "off" */

import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { CategoryModel } from './category';
import { OrderDetailModel } from './orderdetail';

export class ProductModel extends DatabaseModel {
	id: number;

	name: string;

	desc: string;

	price: number;

	category: CategoryModel;

	orderDetail: OrderDetailModel[];
}

export default (sequelize: Sequelize) => {
	ProductModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(200),
		},
		desc: {
			type: DataTypes.STRING(200),
			allowNull: true,
		},
		price: {
			type: DataTypes.FLOAT,
		},
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'product',
	});

	ProductModel.associate = (models) => {
		(ProductModel as any).belongsTo(models.Category, {
			foreignKey: {
				name: 'categoryID',
				allowNull: false,
			},
		});

		(ProductModel as any).hasMany(models.OrderDetail, {
			foreignKey: {
				name: 'DetailProductID',
				allowNull: false,
				constraints: false,
				defaultValue: null,
			},
		});
	};

	return ProductModel;
};
