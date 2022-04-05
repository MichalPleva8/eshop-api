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

import { sequelize } from './db';
import CategoryRouter from './routes/categories';
import ProductRouter from './routes/products';
import handleError from './middleware/handleError';
import localization from './middleware/localization';

dotenv.config();
const app = express();

// Middleware 
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(localization as RequestHandler);
app.use('/api/categories', CategoryRouter());
app.use('/api/products', ProductRouter());

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

httpServer.listen(8000).on('listening', () => {
	console.log('Server started at port 8000');
});

export default httpServer;
