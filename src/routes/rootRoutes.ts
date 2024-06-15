import {Router, Request, Response, NextFunction} from "express";
import {logger} from "../config/logger";
import path from 'path';

export const router = Router();

// API documentation
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});


router.get("/user", (req: Request, res: Response) => {
  res.status(200).json(req.user ? { ...req.user } : {});
});