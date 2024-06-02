"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const passport_1 = __importDefault(require("passport"));
const express_session_1 = __importDefault(require("express-session"));
const authRoute_1 = require("./routes/authRoute");
const rootRoutes_1 = require("./routes/rootRoutes");
const apiRoutes_1 = require("./routes/apiRoutes");
const corsMiddleware_1 = require("./middleware/corsMiddleware");
const sessionMiddleware_1 = require("./middleware/sessionMiddleware");
const logger_1 = require("./config/logger");
const requestLogger_1 = require("./middleware/requestLogger");
const errorHandler_1 = require("./middleware/errorHandler");
const app = (0, express_1.default)();
// middleware stack
app.use(express_1.default.json({ limit: "50mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cors_1.default)(corsMiddleware_1.corsMiddleware));
app.use((0, express_session_1.default)(sessionMiddleware_1.sessionMiddleware));
// authentication stack
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use(requestLogger_1.httpLogger);
// routes stack
app.use("/", rootRoutes_1.router);
app.use("/auth", authRoute_1.router);
// api routes
app.use("/api", apiRoutes_1.router);
app.use(errorHandler_1.notFoundHandler);
app.use(errorHandler_1.errorHandler);
const port = process.env.PORT || 8000;
app.listen(port, () => {
    logger_1.logger.info(`server listening at http://localhost:${port}`);
});
