import http from 'http';
import express, {
	RequestHandler,
	ErrorRequestHandler,
} from 'express';
import * as bodyParser from 'body-parser';
import * as dotenv from 'dotenv';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import { sequelize } from './db';
import CategoryRouter from './routes/categories';
import ProductRouter from './routes/products';
import AuthRouter from './routes/auth';
import UserRouter from './routes/users';
import OrderRouter from './routes/orders';
import handleError from './middleware/handleError';
import handleLocalization from './middleware/handleLocalization';
import authProtect from './middleware/authMiddleware';
import handleNotFound from './middleware/handleNotFound';

dotenv.config();
const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(helmet());
app.use(cors({ origin: '*' }));
app.use(morgan('dev'));
app.use(handleLocalization as RequestHandler);
app.use('/api/categories', authProtect, CategoryRouter());
app.use('/api/products', authProtect, ProductRouter());
app.use('/api/users', authProtect, UserRouter());
app.use('/api/orders', authProtect, OrderRouter());
app.use('/api/auth', AuthRouter());

// Handle 500 (Internal Error)
app.use(handleError as ErrorRequestHandler);

// Handle 404 (Page not found)
app.all('/*', handleNotFound);

const httpServer = http.createServer(app);

sequelize.sync();
console.log('Sync database', process.env.DATABASE_URL);

httpServer.listen(PORT).on('listening', () => {
	console.log('Server started at port 8000');
});

export default httpServer;
