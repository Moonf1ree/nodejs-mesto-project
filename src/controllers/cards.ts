import { NextFunction, Request, Response } from 'express';
import Card from '../models/card';
import BadRequestError from '../errors/bad-request-error';
import NotFoundError from '../errors/not-found-error';
import ForbiddenError from '../errors/forbidden-error';

const getCards = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const cards = await Card.find({});
    return res.send(cards);
  } catch (err) {
    return next(err);
  }
};

const createCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return next(new BadRequestError('Переданы некорректные данные карточки'));
    }

    return next(err);
  }
};

const deleteCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findById(req.params.cardId);

    if (!card) {
      return next(new NotFoundError('Карточка по указанному id не найдена'));
    }

    if (card.owner.toString() !== req.user._id) {
      return next(new ForbiddenError('Нельзя удалить чужую карточку'));
    }

    await card.deleteOne();

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id карточки'));
    }

    return next(err);
  }
};

const likeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Карточка по указанному id не найдена'));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id карточки'));
    }

    return next(err);
  }
};

const dislikeCard = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return next(new NotFoundError('Карточка по указанному id не найдена'));
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return next(new BadRequestError('Передан некорректный id карточки'));
    }

    return next(err);
  }
};

export {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
