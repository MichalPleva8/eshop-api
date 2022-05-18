import {
	Request,
	Response,
	NextFunction,
} from 'express';
import { sign } from 'jsonwebtoken';
import * as bcrypt from 'bcrypt';

import { models } from '../db';
import { USER_ROLES } from '../utils/enums';

const {
	User,
} = models;

const register = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;
	const role = req.body.role || 'USER';

	try {
		const users = await User.findOne({
			where: { email: email.toLowerCase() },
		});

		// Check if is unique
		if (users) {
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
};

const login = async (req: Request, res: Response, next: NextFunction) => {
	const { email, password } = req.body;

	try {
		const users = await User.findOne({
			where: { email: email.toLowerCase() },
		});

		if (!users) {
			return res.status(404).json({
				data: {},
				message: req.isSk ? 'Zlé údaje!' : 'Wrong credentails!',
			});
		}

		const result = await bcrypt.compare(password, users.password);

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
			{ expiresIn: '30m' },
		);

		const refresh = sign(
			data,
			process.env.REFRESH_SECRET as string,
			{ expiresIn: '7d' },
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
};

export {
	register,
	login,
};
