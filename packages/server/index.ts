import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import router from './routes';

const app = express();
app.use(express.json());
app.use(helmet());
app.use(compression());
app.use(router);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
