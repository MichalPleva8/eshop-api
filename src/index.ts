import http from 'http';
import express, {
	Request,
	Response,
	NextFunction,
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
import localization from './middleware/localization';
import authorization from './middleware/authorization';

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
app.use(localization as RequestHandler);
app.use('/api/categories', authorization, CategoryRouter());
app.use('/api/products', authorization, ProductRouter());
app.use('/api/users', authorization, UserRouter());
app.use('/api/orders', authorization, OrderRouter());
app.use('/api/auth', AuthRouter());

// Handle 500 (Internal Error)
app.use(handleError as ErrorRequestHandler);

// Handle 404 (Page not found)
app.all('/*', (req: Request, res: Response, _next: NextFunction) => {
	res.status(404).json({
		data: {},
		message: req.isSk ? 'Nanašla sa žiadna odpoveď pre túto url!' : 'There is nothing on this url!',
	});
});

const httpServer = http.createServer(app);

sequelize.sync();
console.log('Sync database', 'postgresql://postgres:root@localhost:5432/eshop');

httpServer.listen(PORT).on('listening', () => {
	console.log('Server started at port 8000');
});

export default httpServer;
