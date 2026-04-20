import express, { NextFunction, Request, Response } from "express";
import { errors } from "celebrate";
import mongoose from "mongoose";
import usersRouter from "./routes/users";
import cardsRouter from "./routes/cards";
import { createUser, login } from "./controllers/users";
import { requestLogger, errorLogger } from "./middlewares/logger";
import auth from "./middlewares/auth";
import errorHandler from "./middlewares/error-handler";
import { signInValidation, signUpValidation } from "./middlewares/validation";
import NotFoundError from "./errors/not-found-error";

const { PORT = 3000 } = process.env;
const app = express();

app.use(express.json());
app.use(requestLogger);

mongoose.connect("mongodb://localhost:27017/mestodb");

app.post("/signin", signInValidation, login);
app.post("/signup", signUpValidation, createUser);

app.use(auth);
app.use("/users", usersRouter);
app.use("/cards", cardsRouter);

app.use((_req: Request, _res: Response, next: NextFunction) => {
  next(new NotFoundError("Запрашиваемый ресурс не найден"));
});

app.use(errorLogger);
app.use(errors());
app.use(errorHandler);

app.listen(PORT);
