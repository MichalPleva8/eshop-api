import request from 'supertest';
import app from '../app';

import { models } from '../db';

const {
	User,
} = models;

describe('Authentification', () => {
	const userCredentails = {
		email: 'michal.pleva8@gmail.com',
		password: 'secret',
	};

	const wrongUserCredentials = {
		email: 'not@existing.com',
		password: 'notsecret',
	};

	test('Should return access and refresh token to the user', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send(userCredentails);

		expect(res.statusCode).toEqual(200);
		expect(res.body.data).toHaveProperty('accessToken');
		expect(res.body.data).toHaveProperty('refreshToken');
	});

	test('Should return validation error (empty fields)', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send({});

		expect(res.statusCode).toBeGreaterThanOrEqual(400);
	});

	test('Should return 404 because user entered wrong credentials', async () => {
		const res = await request(app)
			.post('/api/auth/login')
			.send(wrongUserCredentials);

		expect(res.statusCode).toEqual(404);
	});

	test('Should fail with 500', async () => {
		const mockUserLogin = jest.fn((): any => {
			throw Error('Test server crash!');
		});

		jest
			.spyOn(User, 'findOne')
			.mockImplementation(() => mockUserLogin());

		const res = await request(app)
			.post('/api/auth/login')
			.send(userCredentails);

		expect(res.statusCode).toEqual(500);
		expect(mockUserLogin).toHaveBeenCalledTimes(1);
	});
});
