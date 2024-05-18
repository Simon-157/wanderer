import "dotenv/config";
import express from "express";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import { router as authRoutes } from "@/routes/authRoute";
import { router as rootRoutes } from "@/routes/rootRoutes";
import { router as apiRoutes } from "@/routes/apiRoutes";
import { corsMiddleware } from "@/middleware/corsMiddleware";
import { sessionMiddleware } from "@/middleware/sessionMiddleware";
import { logger } from "@/config/logger";
import { httpLogger } from "@/middleware/requestLogger";
import { errorHandler, notFoundHandler } from "@/middleware/errorHandler";

const app = express();

// middleware stack
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ extended: true, limit: "50mb" }));
app.use(cors(corsMiddleware));
app.use(session(sessionMiddleware));
// authentication stack
app.use(passport.initialize());
app.use(passport.session());
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