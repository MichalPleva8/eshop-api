/* eslint import/no-cycle: 0 */

import {
	Sequelize,
	DataTypes,
} from 'sequelize';
import { DatabaseModel } from '../types/db';
import { USER_ROLES } from '../utils/enums';

/* eslint no-use-before-define: "warn" */
export class UserModel extends DatabaseModel {
	id: number;

	name: String;

	surname: String;

	nickName: String;

	email: String;

	password: String;

	age: number;

	role: USER_ROLES;

	completed: UserModel;
}

export default (sequelize: Sequelize) => {
	UserModel.init({
		id: {
			type: DataTypes.BIGINT,
			primaryKey: true,
			allowNull: false,
			autoIncrement: true,
		},
		name: {
			type: DataTypes.STRING(200),
		},
		surname: {
			type: DataTypes.STRING(200),
		},
		nickName: {
			type: DataTypes.STRING(200),
		},
		email: {
			type: DataTypes.STRING(200),
			unique: true,
		},
		password: {
			type: DataTypes.STRING(200),
		},
		age: {
			type: DataTypes.INTEGER,
		},
		role: {
			type: DataTypes.ENUM(...Object.values(USER_ROLES)),
			defaultValue: 'USER',
		},
	}, {
		paranoid: true,
		timestamps: true,
		sequelize,
		modelName: 'user',
	});

	return UserModel;
};
