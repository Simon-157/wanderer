import morgan from "morgan";
import { logger } from "../config/logger";

const stream = {
  write: (message: string) => logger.http(`${message}`),
};

export const httpLogger = morgan(
  ":remote-addr :method :url :status :res[content-length] - :response-time ms",
  { stream }
);