import express from 'express';
import cors from 'cors';
import jwt from './middlewares/jwt';
import errorHandler from './middlewares/errorHandler';
import routes from './routes';
import crons from './crons';

require('dotenv').config();

const app = express();

app.use(express.json());
app.use(cors());
app.use(jwt);
app.use(routes);
app.use(errorHandler);

crons();

app.listen(process.env.PORT || 3000);
