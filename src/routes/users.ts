import { Router } from 'express';
import path from 'path';
import multer from 'multer';

import handleImageFiltering from '../middleware/handleImageFiltering';
import handleValidationError from '../middleware/handleValidationError';
import { checkOneUser, checkUserUpdate } from '../validator/users';

import {
	getMyProfile,
	getOneUser,
	getUsers,
	updateMyProfile,
	updateMyProfilePicture,
} from '../controllers/users.controller';

const router: Router = Router();

const storage = multer.diskStorage({
	destination: './uploads',
	filename: (req, file, cb) => {
		cb(null, `${Date.now()}-${req.user.id}${path.extname(file.originalname)}`);
	},
});

const upload = multer({ storage, fileFilter: handleImageFiltering });

export default () => {
	// Get all users (Admin * & User (id, nickName) )
	router.get('/', getUsers);

	// Get my profile
	router.get('/me', getMyProfile);

	// Update my profile (name, surname, nickName, age, tel)
	router.patch(
		'/me',
		checkUserUpdate(),
		handleValidationError,
		updateMyProfile,
	);

	// Update profile picture
	router.put(
		'/me/picture',
		upload.single('picture'),
		updateMyProfilePicture,
	);

	// Get user detail
	// ADMIN: [*], USER: [id, nickName]
	router.get(
		'/:userId',
		checkOneUser(),
		handleValidationError,
		getOneUser,
	);

	return router;
};
