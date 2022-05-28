import { compare } from 'bcrypt';
import config from 'config';
import { Request, Response, Router } from 'express';
import { sign } from 'jsonwebtoken';
import { pick } from 'ramda';
import { TokenData } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';
import { loginValidation } from '../validation/auth.validation';

export const authRouter = Router();

authRouter.post('/login', async (req: Request, res: Response) => {
  const { error } = loginValidation(req.body);

  if (error) {
    return res.status(400).send({ error: error });
  }

  const findUser = await userModel.findOne({ email: req.body.email });

  if (!findUser) {
    res.status(400).send({ error: 'Email not found' });
  }

  const isPasswordMatching = await compare(req.body.password, findUser.password);

  if (!isPasswordMatching) {
    res.status(400).send({ error: 'Password not matching' });
  }

  const tokenData = createToken(findUser);
  const cookie = createCookie(tokenData);

  res.setHeader('Set-Cookie', [cookie]);
  res.status(200).json({ data: pick(['_id', 'name', 'email', 'isAdmin'], findUser), message: 'login' });
});

authRouter.post('/logout', async (req: Request, res: Response) => {
  res.clearCookie('Authorization');
  res.status(200).json({ message: 'logged out' });
});

function createToken(user: User): TokenData {
  const expiresIn = 60 * 60;

  return { expiresIn, token: sign({ _id: user._id }, config.get('secretKey'), { expiresIn }) };
}

function createCookie(tokenData: TokenData) {
  return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}; path=/`;
}
