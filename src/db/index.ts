import path from 'path';
import fs from 'fs';
import { Sequelize } from 'sequelize';

import defineProduct from './product';
import defineCategory from './category';

const sequelize: Sequelize = new Sequelize('postgresql://postgres:root@localhost:5432/eshop', {
	logging: false,
});

sequelize.authenticate().catch((e: any) => console.error(`Unable to connect to the database ${e}`));

const modelsBuilder = (instance: Sequelize) => ({
	Product: instance.import(path.join(__dirname, 'product'), defineProduct),
	Category: instance.import(path.join(__dirname, 'category'), defineCategory),
});

const models = modelsBuilder(sequelize);

// check if every model is imported
const modelsFiles = fs.readdirSync(__dirname)
// -1 because index.ts can not be counted
if (Object.keys(models).length !== (modelsFiles.length - 1)) {
	throw new Error('You probably forgot import database model!');
}

Object.values(models).forEach((value: any) => {
	if (value.associate) {
		value.associate(models);
	}
})

export { models, modelsBuilder, sequelize };