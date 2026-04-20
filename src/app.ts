import express, { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import usersRouter from './routes/users';
import cardsRouter from './routes/cards';

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());

mongoose.connect('mongodb://localhost:27017/mestodb');

app.use((req: Request, _res: Response, next: NextFunction) => {
  req.user = {
    _id: '5d8b8592978f8bd833ca8133',
  };

  next();
});

app.use('/users', usersRouter);
app.use('/cards', cardsRouter);

app.use((_req: Request, res: Response) => {
  res.status(404).send({ message: 'Запрашиваемый ресурс не найден' });
});

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
