import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import { Sequelize } from 'sequelize';

import defineProduct from './product';
import defineCategory from './category';
import defineUser from './user';
import defineOrder from './order';
import defineOrderDetail from './orderdetail';

dotenv.config();

const sequelize: Sequelize = new Sequelize(process.env.DATABASE_URL!, {
	logging: false,
});

sequelize.authenticate().catch((e: any) => console.error(`Unable to connect to the database ${e}`));

const modelsBuilder = (instance: Sequelize) => ({
	Product: instance.import(path.join(__dirname, 'product'), defineProduct),
	Category: instance.import(path.join(__dirname, 'category'), defineCategory),
	User: instance.import(path.join(__dirname, 'user'), defineUser),
	Order: instance.import(path.join(__dirname, 'order'), defineOrder),
	OrderDetail: instance.import(path.join(__dirname, 'orderdetail'), defineOrderDetail),
});

const models = modelsBuilder(sequelize);

if (process.env.NODE_ENV === 'development') {
	// check if every model is imported
	const modelsFiles = fs.readdirSync(__dirname);
	// -1 because index.ts can not be counted
	if (Object.keys(models).length !== (modelsFiles.length - 1)) {
		throw new Error('You probably forgot import database model!');
	}
}

Object.values(models).forEach((value: any) => {
	if (value.associate) {
		value.associate(models);
	}
});

export { models, modelsBuilder, sequelize };
