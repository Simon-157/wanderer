import {Router, Request, Response, NextFunction} from "express";
import {logger} from "../config/logger";
import path from 'path';

export const router = Router();

// API documentation
router.get('/', (req: Request, res: Response, next: NextFunction) => {
    res.sendFile(path.join(__dirname, '../index.html'));
});

// router.get("/user", (req: Request, res: Response, next: NextFunction) => {
//     // logger.info(`auth user ID ${req.user}`);
//     try {
//         res.status(200).json(req.session ? {...req.user} : {});
//     } catch (error) {
//         logger.error(`${error}`);
//         next(error);

//     }
// });


router.get("/user", (req: Request, res: Response) => {
  if (req.user) {
    logger.info("currentuser", req.user);
    res.status(200).json({ ...req.user });
  } else if (req.session) {
    const user = {
      
    }

    req.user = user;
    logger.info("currentuser", req.user);
    res.status(200).json({ ...req.user });
  
  } else {
    res.status(200).json({});
  }
});