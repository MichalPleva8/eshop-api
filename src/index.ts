import http from 'http';
import * as dotenv from 'dotenv';

import app from './app';
import { sequelize } from './db';

dotenv.config();
const PORT = process.env.PORT || 8000;

const httpServer = http.createServer(app);

sequelize.sync();
console.log('Sync database', process.env.DATABASE_URL);

httpServer.listen(PORT).on('listening', () => {
	console.log('Server started at port 8000');
});

export default httpServer;
