import { Model } from 'sequelize';

/* eslint no-unused-vars: "off" */
export class DatabaseModel<T = string, T2 = Model> extends Model<T, T2> {
	static associate?: (models: any) => void;
}
