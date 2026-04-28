import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/user';
import { JWT_SECRET, STATUS_CODES } from '../constants';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ConflictError from '../errors/conflict-error';
import UnauthorizedError from '../errors/unauthorized-error';

interface MongoDuplicateKeyError {
  code: number;
}

const isMongoDuplicateKeyError = (error: unknown): error is MongoDuplicateKeyError => (
  typeof error === 'object'
  && error !== null
  && 'code' in error
  && typeof (error as MongoDuplicateKeyError).code === 'number'
);

const getUsers = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await User.find({});
    return res.send(users);
  } catch (err) {
    return next(err);
  }
};

const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return next(new NotFoundError('Запрашиваемый пользователь не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id пользователя'));
    }
    return next(err);
  }
};

const createUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const createdUser = await User.create({
      name,
      about,
      avatar,
      email,
      password: passwordHash,
    });

    return res.status(STATUS_CODES.CREATED).send({
      _id: createdUser._id,
      name: createdUser.name,
      about: createdUser.about,
      avatar: createdUser.avatar,
      email: createdUser.email,
    });
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные пользователя'));
    }

    if (isMongoDuplicateKeyError(err) && err.code === 11000) {
      return next(new ConflictError('Пользователь с таким email уже существует'));
    }

    return next(err);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');

    if (!user || !user.password) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const matched = await bcrypt.compare(password, user.password);

    if (!matched) {
      return next(new UnauthorizedError('Неправильные почта или пароль'));
    }

    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: '7d' });

    return res.send({ token });
  } catch (err) {
    return next(err);
  }
};

const getCurrentUser = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id пользователя'));
    }

    return next(err);
  }
};

const updateProfile = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные профиля'));
    }
    return next(err);
  }
};

const updateAvatar = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );

    if (!user) {
      return next(new NotFoundError('Пользователь не найден'));
    }

    return res.send(user);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные аватара'));
    }
    return next(err);
  }
};

export {
  getUsers,
  getUserById,
  createUser,
  login,
  getCurrentUser,
  updateProfile,
  updateAvatar,
};
