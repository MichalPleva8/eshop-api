import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';

import onlyAdmin from '../middleware/onlyAdmin';
import { models } from '../db';

const router: Router = Router();

const {
	User,
} = models;

export default () => {
	// Get all users (Admin * & User (id, nickName) )
	router.get('/', async (req: Request, res: Response, _next: NextFunction) => {
		const { role } = req.user;

		let users;
		if (role === 'ADMIN') {
			users = await User.findAll();
		} else {
			users = await User.findAll({
				attributes: ['id', 'nickName'],
			});
		}

		return res.status(200).json({
			data: users,
			message: req.isSk ? 'Zoznam všetkých používateľov' : 'List of all users',
		});
	});

	// Get user profile
	router.get('/me', async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.user;

		const data = await User.findOne({
			where: { id },
			attributes: ['name', 'surname', 'age', 'nickName'],
		});

		res.status(200).json({
			data,
			message: req.isSk ? 'Váš profile' : 'Your profile',
		});
	});

	// Get user detail (Admin)
	router.get('/:id', async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.params;
		const { role } = req.user;

		let users;
		if (role === 'ADMIN') {
			users = await User.findAll({
				where: { id },
			});
		} else if (role === 'USER') {
			users = await User.findAll({
				where: { id },
				attributes: ['id', 'nickName'],
			});
		}

		if (typeof users === 'object' && users.length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Nenašli sme žiadneho používateľa' : 'No user found!',
			});
		}

		return res.status(200).json({
			data: users,
			message: req.isSk ? 'Používateľové dáta' : 'List of user data',
		});
	});

	// Update User (Admin)
	router.patch('/:id', onlyAdmin, async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.params;

		// Check if id is not empty
		if (!id) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'id parameter nebol nájdení!' : 'id parameter was not found!',
			});
		}

		// Check if body is not empty
		if (Object.keys(req.body).length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadne hodnoty neboli zadané!' : 'No values were entered!',
			});
		}

		// Check if email is valid
		if (typeof req.body.email === 'string') {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Nemôžeťe upraviť emailovú adresu!' : 'You can\'t update email!',
			});
		}

		// Values that doesn't exist in schema will not update anything so I can pass req.body
		const count = await User.update(req.body, {
			where: { id },
		});

		// Check if row was updated
		if (count <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? (
					'Žiadny používateľ nebol upravený, prosím zadajte id existujúceho používateľa a platné používateľské dáta ktoré chcete zmeniť'
				) : (
					'No user was deleted, please enter id of existing user and valid user detail you want to change'
				),
			});
		}

		return res.status(200).json({
			data: {},
			message: req.isSk ? 'Používateľ bol upravený!' : 'User was updated',
		});
	});

	return router;
};
