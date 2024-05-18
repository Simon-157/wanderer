// const speakeasy = require('speakeasy');
import { appUser } from '@prisma/client';
import Joi from 'joi';
import bcrypt from 'bcrypt';
import twilio from 'twilio';

export function validateUser(user:appUser) {
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

export const generateMfaToken = async() => {
    // return speakeasy.totp({ secret: 'your_secret_key', encoding: 'base32' });

    return Math.floor(100000 + Math.random() * 900000);
}


const twilioClient = twilio('ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');

export const sendSms = async (phoneNumber:string, token:any) => {
    try {
        await twilioClient.messages.create({
            body: `Your wanderer verification code is ${token}\n Please do not share this code with anyone. It is only valid for 5 minutes.`,
            from: 'TWILIO_PHONE_NUMBER',
            to: phoneNumber
        });
        return true;
    } catch (err) {
        console.error(err);
        return false;
    }
}

export const sendEmail = (email:string, token:any)  => {
    // Implement email sending logic using a library like Nodemailer
}

export const  saveMfaToken = (userId:string, token:any) => {
// Save the generated MFA token in the database or in a temporary cache
}

export const  retrieveMfaToken = (userId:any) => {
    // Retrieve the stored MFA token from the database or cache
}
