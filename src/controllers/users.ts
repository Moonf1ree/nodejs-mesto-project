import { Request, Response } from 'express';
import User from '../models/user';

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getUsers = async (_req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res
        .status(NOT_FOUND)
        .send({ message: 'Запрашиваемый пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id пользователя' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const createUser = async (req: Request, res: Response) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    return res.status(201).send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const updateProfile = async (req: Request, res: Response) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные профиля' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const updateAvatar = async (req: Request, res: Response) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return res.status(NOT_FOUND).send({ message: 'Пользователь не найден' });
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные аватара' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  updateProfile,
  updateAvatar,
};
