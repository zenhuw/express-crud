import 'dotenv/config';
import compression from 'compression';
import config from 'config';
import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import { connectDB } from './utils/db-connect';
import { initRoutes } from './routes';
import cookieParser from 'cookie-parser';

const app = express();

app.use(helmet());

app.use(compression());

app.use(cors({ origin: config.get('cors.origin'), credentials: config.get('cors.credentials') }));

app.use(cookieParser());

connectDB();

initRoutes(app);

const port = process.env.PORT || 3000;

export const server = app.listen(port, () => {
  console.log(`App is running at http://localhost:${port} in %s mode`, app.get('env'));
});
