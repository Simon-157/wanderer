"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.retrieveMfaToken = exports.saveMfaToken = exports.sendEmail = exports.sendSms = exports.generateMfaToken = exports.validatePassword = exports.validateUser = void 0;
const joi_1 = __importDefault(require("joi"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const twilio_1 = __importDefault(require("twilio"));
function validateUser(user) {
    const schema = joi_1.default.object({
        email: joi_1.default.string().email().required(),
        password: joi_1.default.string().min(8).required(),
        firstName: joi_1.default.string().min(1).required(),
        lastName: joi_1.default.string().min(1).required(),
    });
    return schema.validate(user);
}
exports.validateUser = validateUser;
const validatePassword = (hashedpassword, password) => {
    return bcrypt_1.default.compare(password, hashedpassword);
};
exports.validatePassword = validatePassword;
const generateMfaToken = async () => {
    // return speakeasy.totp({ secret: 'your_secret_key', encoding: 'base32' });
    return Math.floor(100000 + Math.random() * 900000);
};
exports.generateMfaToken = generateMfaToken;
const twilioClient = (0, twilio_1.default)('ACCOUNT_SID', 'TWILIO_AUTH_TOKEN');
const sendSms = async (phoneNumber, token) => {
    try {
        await twilioClient.messages.create({
            body: `Your wanderer verification code is ${token}\n Please do not share this code with anyone. It is only valid for 5 minutes.`,
            from: 'TWILIO_PHONE_NUMBER',
            to: phoneNumber
        });
        return true;
    }
    catch (err) {
        console.error(err);
        return false;
    }
};
exports.sendSms = sendSms;
const sendEmail = (email, token) => {
    // Implement email sending logic using a library like Nodemailer
};
exports.sendEmail = sendEmail;
const saveMfaToken = (userId, token) => {
    // Save the generated MFA token in the database or in a temporary cache
};
exports.saveMfaToken = saveMfaToken;
const retrieveMfaToken = (userId) => {
    // Retrieve the stored MFA token from the database or cache
};
exports.retrieveMfaToken = retrieveMfaToken;
