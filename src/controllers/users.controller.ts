import { hash } from 'bcrypt';
import { Request, Response, Router } from 'express';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { userValidatorsPost, userValidatorsPut } from '../validation/user.validation';
import { isEmpty, isNil, pick } from 'ramda';
import { isValidObjectId } from 'mongoose';
import { isAdmin } from '../middlewares/isAdmin.middleware';
import { RequestModified } from '../interfaces/auth.interface';

export const userRouter = Router();

userRouter.post('/', isAdmin, async (req: Request, res: Response) => {
  const { error } = userValidatorsPost(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }

  const user = await userModel.findOne({ email: req.body.email });

  if (user) {
    return res.status(400).send({ error: 'User already exist' });
  }

  const hashedPassword = await hash(req.body.password, 10);

  const createdUserData: User = await userModel.create({ ...req.body, password: hashedPassword });

  return res.status(201).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], createdUserData), message: 'created' });
});

userRouter.get('/', isAdmin, async (req: Request, res: Response) => {
  let users: User[] = await userModel.find();

  users = users.map(res => {
    return pick(['_id', 'name', 'email', 'isAdmin'], res);
  });

  return res.status(200).json({ data: users, message: 'findAll' });
});

userRouter.get('/me', async (req: RequestModified, res: Response) => {
  if (isNil(req.user)) {
    return res.status(401).send({ error: 'User not logged in' });
  }

  return res.status(200).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], req.user), message: 'me' });
});

userRouter.get('/:id', isAdmin, async (req: Request, res: Response) => {
  if (isEmpty(req.params.id)) {
    return res.status(400).send({ error: 'Parameter is empty' });
  }

  if (!isValidObjectId(req.params.id)) {
    return res.status(400).send({ error: 'Parameter not valid' });
  }

  const findUser = await userModel.findOne({ _id: req.params.id });

  if (!findUser) {
    return res.status(404).send({ error: 'User Not Found' });
  }

  return res.status(200).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], findUser), message: 'findOne' });
});

userRouter.put('/:id', isAdmin, async (req: Request, res: Response) => {
  const { error } = userValidatorsPut(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }

  if (isEmpty(req.params.id)) {
    return res.status(400).send({ error: 'Parameter is empty' });
  }

  if (!isValidObjectId(req.params.id)) {
    return res.status(400).send({ error: 'Parameter not valid' });
  }

  if (req.body.email) {
    const findUser = await userModel.findOne({ email: req.body.email });
    if (findUser && findUser._id != req.params.id) {
      return res.status(400).send({ error: 'Email already exist' });
    }
  }

  if (req.body.password) {
    const hashedPassword = await hash(req.body.password, 10);
    req.body = { ...req.body, password: hashedPassword };
  }

  const updateUserByid = await userModel.findByIdAndUpdate(req.params.id, { ...req.body }, { new: true });

  if (!updateUserByid) {
    return res.status(400).send({ error: 'User not found' });
  }

  return res.status(200).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], updateUserByid), message: 'updated' });
});

userRouter.delete('/:id', isAdmin, async (req: Request, res: Response) => {
  if (!isValidObjectId(req.params.id)) {
    return res.status(400).send({ error: 'Parameter not valid' });
  }

  const deleteUserById = await userModel.findByIdAndDelete(req.params.id);

  if (!deleteUserById) {
    return res.status(400).send({ error: 'User not exist' });
  }

  return res.status(200).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], deleteUserById), message: 'deleted' });
});
