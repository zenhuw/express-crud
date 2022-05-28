import config from 'config';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { DataStoredInToken, RequestModified } from '../interfaces/auth.interface';
import { User } from '../interfaces/users.interface';
import userModel from '../models/users.model';

export const authMiddleware = async (req: RequestModified, res: Response, next: NextFunction) => {
  const Authorization = req.cookies['Authorization'] || (req.header('Authorization') ? req.header('Authorization').split('Bearer ')[1] : null);

  if (Authorization) {
    const verification = verify(Authorization, config.get('secretKey')) as DataStoredInToken;
    const findUser = await userModel.findOne({ _id: verification._id }) as User;
    if (findUser) {
      req.user = findUser;
    }
  }

  next();
};
