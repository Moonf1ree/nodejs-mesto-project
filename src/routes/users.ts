import { Router } from 'express';
import {
  getUsers,
  getUserById,
  getCurrentUser,
  updateProfile,
  updateAvatar,
} from '../controllers/users';
import {
  userIdValidation,
  profileValidation,
  avatarValidation,
} from '../middlewares/validation';

const usersRouter = Router();

usersRouter.get('/', getUsers);
usersRouter.get('/me', getCurrentUser);
usersRouter.get('/:userId', userIdValidation, getUserById);
usersRouter.patch('/me', profileValidation, updateProfile);
usersRouter.patch('/me/avatar', avatarValidation, updateAvatar);

export default usersRouter;
