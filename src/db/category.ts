/* eslint no-unused-vars: "off" */

import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { ProductModel } from './product';

export class CategoryModel extends DatabaseModel {
	id: number
	name: String

	products: ProductModel[]
}

export default (sequelize: Sequelize) => {
	CategoryModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true
		},
		name: {
			type: DataTypes.STRING(200),
		},
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'category'
	});

	CategoryModel.associate = (models) => {
		(CategoryModel as any).hasMany(models.Product, {
			foreignKey: {
				name: 'categoryID',
				allowNull: false,
			},
			as: 'products',
		});
	}

	return CategoryModel;
}
