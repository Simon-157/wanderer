import { User } from '@prisma/client';
import Joi from 'joi';
import bcrypt from 'bcrypt';

export function validateUser(user:User) {
  const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(8).required(),
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
  });

  return schema.validate(user);
}


export const validatePassword = (hashedpassword:string, password:string) =>{
    return bcrypt.compare(password, hashedpassword);
}