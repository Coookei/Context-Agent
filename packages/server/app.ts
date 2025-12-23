import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from './middleware/cors';
import router from './routes';
import { error, notFound } from './middleware/error';

const app = express();

app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(cors);
app.use(router);
app.use(error);
app.use(notFound);

export default app;
