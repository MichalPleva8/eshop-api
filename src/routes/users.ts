import path from 'path';
import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';
import multer from 'multer';

import onlyAdmin from '../middleware/onlyAdmin';
import { models } from '../db';
import imageFilter from '../middleware/imageFilter';

const router: Router = Router();
const storage = multer.diskStorage({
	destination: './uploads',
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${req.user.id}${path.extname(file.originalname)}`);
	},
});
const upload = multer({ storage, fileFilter: imageFilter });

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
				attributes: ['id', 'nickName', 'profile_pic'],
			});
		}

		return res.status(200).json({
			data: users,
			message: req.isSk ? 'Zoznam všetkých používateľov' : 'List of all users',
		});
	});

	// Get my profile
	router.get('/me', async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.user;

		const data = await User.findOne({
			where: { id },
			attributes: ['name', 'surname', 'age', 'nickName', 'tel', 'profile_pic'],
		});

		return res.status(200).json({
			data,
			message: req.isSk ? 'Váš profile' : 'Your profile',
		});
	});

	// Update my profile
	router.patch('/me', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.user;

		// Check if body is not empty
		if (Object.keys(req.body).length <= 0) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadne hodnoty neboli zadané!' : 'No values were entered!',
			});
		}

		const affected = await User.update(req.body, {
			where: { id },
			returning: true,
		})
		.then((result: any) => result[0])
		.catch((err: any) => {
			const errorMessage: any = new Error('Failed to update user profile!');

			return next(errorMessage);
		});

		// Check if row was updated
		if (!affected) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? (
					'Profil nebol upravený!'
				) : (
					'Profile was not updated!'
				),
			});
		}

		return res.status(200).json({
			data: {},
			message: req.isSk ? 'Váš profile bol upravený!' : 'Your profile was updated!',
		});
	});

	// Update profile picture
	router.put('/me/picture', upload.single('picture'), async (req: Request, res: Response, _next: NextFunction) => {
		const { id } = req.user;

		// Check if file is image
		if (req.fileError) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Nesprávný typ súboru!' : 'Invalid image file type!',
			});
		}

		const affected = await User.update({
			profile_pic: `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${req.file?.filename}`,
		}, {
			where: { id },
			returning: true,
		})
		.then((result: any) => result[0])
		.catch((err: any) => {
			console.error(err);
			res.end();
		});

		// Check if row was updated
		if (!affected) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? (
					'Profil nebol upravený!'
				) : (
					'Profile was not updated!'
				),
			});
		}

		return res.status(200).json({
			data: {},
			message: req.isSk ? 'Profilovka bola upravená!' : 'Profile picture was updated!',
		});
	});

	// Get user detail (Admin)
	router.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.params;
		const { role } = req.user;

		// Check if id param is number
		if (Number.isNaN(Number(id))) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Id musí byť číslo!' : 'Id must be number!',
			});
		}

		let attributes: string[] = [];
		if (role === 'USER') {
			attributes = ['id', 'nickName'];
		}

		const users = await User.findOne({
			where: { id },
			attributes: attributes.length > 0 ? attributes : undefined,
		}).catch((err: any) => {
			const errorMessage = new Error('Failed to query user data!');
			next(errorMessage);
		});

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
		const affected = await User.update(req.body, {
			where: { id },
			returning: true,
		});

		// Check if row was updated
		if (affected <= 0) {
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
			message: req.isSk ? 'Používateľ bol upravený!' : 'User was updated!',
		});
	});

	return router;
};
