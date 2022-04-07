/* eslint no-unused-vars: "off" */

import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { CategoryModel } from './category';

export class ProductModel extends DatabaseModel {
	id: number;

	name: String;

	price: number;

	category: CategoryModel;
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
	};

	return ProductModel;
};
