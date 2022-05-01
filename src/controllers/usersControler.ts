import {
	Request,
	Response,
	NextFunction,
} from 'express';

import { USER_ROLES } from '../utils/enums';
import { models } from '../db';

const {
	User,
} = models;

const getUsers = async (req: Request, res: Response, next: NextFunction) => {
	const { role } = req.user;

	try {
		const users = await User.findAll({
			attributes: role === USER_ROLES.ADMIN ? undefined : ['id', 'nickName', 'profile_pic'],
		});

		if (!users) {
			res.status(400).json({
				data: {},
				message: req.isSk ? 'Žiadny používatelia sa nenašli!' : 'No users found!',
			});
		}

		return res.status(200).json({
			data: users,
			message: req.isSk ? 'Zoznam všetkých používateľov' : 'List of all users',
		});
	} catch (error) {
		return next(error);
	}
};

const getMyProfile = async (req: Request, res: Response, next: NextFunction) => {
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
};

const updateMyProfile = async (req: Request, res: Response, next: NextFunction) => {
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
};

const updateMyProfilePicture = async (req: Request, res: Response, next: NextFunction) => {
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
};

const getOneUser = async (req: Request, res: Response, next: NextFunction) => {
	const { userId } = req.params;
	const { role } = req.user;

	try {
		const user = await User.findOne({
			where: { id: userId },
			attributes: role === USER_ROLES.ADMIN ? undefined : ['id', 'nickName'],
		});

		if (!user) {
			return res.status(400).json({
				data: {},
				message: req.isSk ? 'Nenašli sme žiadneho používateľa' : 'No user found!',
			});
		}

		return res.status(200).json({
			data: user,
			message: req.isSk ? 'Používateľové dáta' : 'List of user data',
		});
	} catch (error) {
		return next(error);
	}
};

export {
	getUsers,
	getOneUser,
	getMyProfile,
	updateMyProfile,
	updateMyProfilePicture,
};
