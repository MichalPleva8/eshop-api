import {
	models,
	sequelize,
} from './db/index'

const {
	Product,
	Category,
} = models

const seedDB = async () => {
	await sequelize.sync({ force: true })

	await Category.bulkCreate([{
		name: 'sport',
	}, {
		name: 'beauty',
	}, {
		name: 'games',
	}, {
		name: 'furniture',
	}, {
		name: 'computer'
	}, {
		name: 'food',
	}] as any[], { returning: true });

	await Product.bulkCreate([{
		name: 'Product 1',
		price: 14.99,
		categoryID: 1,
	}, {
		name: 'Product 2',
		price: 19.99,
		categoryID: 2,
	}, {
		name: 'Product 3',
		price: 59.50,
		categoryID: 3,
	}, {
		name: 'Product 4',
		price: 200.00,
		categoryID: 5, 
	}, {
		name: 'Product 5',
		price: 5.20,
		categoryID: 1,
	}]);
}

seedDB().then(() => {
	console.log('DB seed done')
	process.exit(0)
}).catch((err) => {
	console.error('error in seed, check your data and model \n \n', err)
	process.exit(1)
})