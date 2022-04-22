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
	router.get('/', async (req: Request, res: Response, next: NextFunction) => {
		const { role } = req.user;
		let users;

		try {
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
		} catch (error) {
			return next(error);
		}
	});

	// Get my profile
	router.get('/me', async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.user;

		try {
			const data = await User.findOne({
				where: { id },
				attributes: ['name', 'surname', 'age', 'nickName', 'tel', 'profile_pic'],
			});

			return res.status(200).json({
				data,
				message: req.isSk ? 'Váš profile' : 'Your profile',
			});
		} catch (error) {
			return next(error);
		}
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

		try {
			const affected = await User.update(req.body, {
				where: { id },
				returning: true,
			})[0];

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
		} catch (error) {
			return next(error);
		}
	});

	// Update profile picture
	router.put('/me/picture', upload.single('picture'), async (req: Request, res: Response, next: NextFunction) => {
		const { id } = req.user;

		// Check if file is image
		if (req.fileError) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Nesprávný typ súboru!' : 'Invalid image file type!',
			});
		}

		try {
			const affected = await User.update({
				profile_pic: `${req.protocol}://${req.hostname}:${process.env.PORT}/uploads/${req.file?.filename}`,
			}, {
				where: { id },
				returning: true,
			})[0];

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
		} catch (error) {
			return next(error);
		}
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

		try {
			const users = await User.findOne({
				where: { id },
				attributes: attributes.length > 0 ? attributes : undefined,
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
		} catch (error) {
			return next(error);
		}
	});

	// Update User (Admin)
	router.patch('/:id', onlyAdmin, async (req: Request, res: Response, next: NextFunction) => {
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

		try {
			const affected = await User.update(req.body, {
				where: { id },
				returning: true,
			})[0];

			// Check if row was updated
			if (affected <= 0) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? (
						'Žiadny používateľ nebol upravený!'
					) : (
						'No user was updated!'
					),
				});
			}

			return res.status(200).json({
				data: {},
				message: req.isSk ? 'Používateľ bol upravený!' : 'User was updated!',
			});
		} catch (error) {
			return next(error);
		}
	});

	return router;
};
