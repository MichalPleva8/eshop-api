import {
	Router,
	Request,
	Response,
	NextFunction,
} from 'express';
import * as bcrypt from 'bcrypt';
import { sign } from 'jsonwebtoken';
import validator from 'validator';

import { models } from '../db';
import { USER_ROLES } from '../utils/enums';

const { isEmail } = validator;

const router: Router = Router();

const {
	User,
} = models;

export default () => {
	router.post('/register', async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;
		const role = req.body.role || 'USER';

		// Check if is not empty
		if (!(email && password)) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím vyplňte všetky polia!' : 'Please fill out all fields!',
			});
		}

		// Check if email is valid
		if (!isEmail(email)) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Neplatná emailová adresa!' : 'Invalid email address!',
			});
		}

		try {
			const users = await User.findAll({
				where: { email },
			});

			// Check if is unique
			if (users.length > 0) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Používateľ už existuje!' : 'User already exists!',
				});
			}

			// Check if is role valid
			if (!Object.values(USER_ROLES).includes(role.toUpperCase())) {
				return res.status(400).json({
					data: {},
					message: req.isSk ? 'Neplatná role!' : 'Invalid role!',
				});
			}

			const hashed = await bcrypt.hash(password, 10);

			const newUser = await User.build({ email: email.toLowerCase(), password: hashed, role });
			await newUser.save();

			return res.status(201).json({
				data: {},
				message: req.isSk ? 'Boli ste úspešne zaregistrovaný!' : 'You have been successfuly registered!',
			});
		} catch (error) {
			return next(error);
		}
	});

	/* eslint consistent-return: "off" */
	router.post('/login', async (req: Request, res: Response, next: NextFunction) => {
		const { email, password } = req.body;

		// Check if all fields are filled
		if (!(email && password)) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Prosím vyplňte všetky polia!' : 'Please fill out all fields!',
			});
		}

		try {
			// Check if user exists
			// I used 404 to hide any of sensitive data was typed right
			const users = await User.findOne({
				where: { email },
			});

			if (!users || users.length <= 0) {
				return res.status(404).json({
					data: {},
					message: req.isSk ? 'Zlé údaje!' : 'Wrong credentails!',
				});
			}

			const result = await bcrypt.compare(password, users.password);

			// Check if password was correct
			// I used 404 to hide any of sensitive data was typed right
			if (!result) {
				return res.status(404).json({
					data: {},
					message: req.isSk ? 'Zlé údaje!' : 'Wrong credentails!',
				});
			}

			const data = {
				id: users.dataValues.id,
				email,
				role: users.dataValues.role,
			};

			const token = sign(
				data,
				process.env.TOKEN_SECRET as string,
				{
					expiresIn: '30m',
				},
			);

			const refresh = sign(
				data,
				process.env.REFRESH_SECRET as string,
				{
					expiresIn: '7d',
				},
			);

			return res.status(200).json({
				data: {
					accessToken: token,
					refreshToken: refresh,
				},
				message: req.isSk ? 'Boli ste úspešne prihlasený!' : 'You have been successfuly logged in!',
			});
		} catch (error) {
			return next(error);
		}
	});

	return router;
};
