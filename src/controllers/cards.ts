import { Request, Response } from 'express';
import Card from '../models/card';

const BAD_REQUEST = 400;
const NOT_FOUND = 404;
const SERVER_ERROR = 500;

const getCards = async (_req: Request, res: Response) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const createCard = async (req: Request, res: Response) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    return res.status(201).send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'ValidationError') {
      return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const deleteCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndDelete(req.params.cardId);

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const likeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

const dislikeCard = async (req: Request, res: Response) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );

    if (!card) {
      return res.status(NOT_FOUND).send({ message: 'Карточка по указанному id не найдена' });
    }

    return res.send(card);
  } catch (err) {
    if (err instanceof Error && err.name === 'CastError') {
      return res.status(BAD_REQUEST).send({ message: 'Передан некорректный id карточки' });
    }

    return res.status(SERVER_ERROR).send({ message: 'На сервере произошла ошибка' });
  }
};

export {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
