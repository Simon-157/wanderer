import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { router as authRoutes } from "./routes/authRoute";
import { router as rootRoutes } from "./routes/rootRoutes";
import { router as apiRoutes } from "./routes/apiRoutes";
import { corsMiddleware } from "./middleware/corsMiddleware";
import { sessionMiddleware } from "./middleware/sessionMiddleware";
import { logger } from "./config/logger";
import { httpLogger } from "./middleware/requestLogger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";

const app = express();

// middleware stack
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));

app.set("trust proxy", 1);
app.use(cors(corsMiddleware));
app.use(session(sessionMiddleware));
app.use(passport.initialize());
app.use(passport.session());


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  next();
});

app.use(httpLogger);

// routes stack
app.use("/", rootRoutes);
app.use("/auth", authRoutes);


// api routes
app.use("/api", apiRoutes);


app.use(notFoundHandler);
app.use(errorHandler);


const port = process.env.PORT || 8000;

app.listen(port, () => {
  logger.info(`server listening at http://localhost:${port}`);
});