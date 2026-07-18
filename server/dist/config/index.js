"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.config = {
    port: Number(process.env.PORT) || 4000,
    mongoUri: process.env.MONGO_URI || "mongodb://127.0.0.1:27017/realestate",
    jwtSecret: process.env.JWT_SECRET || "change-me-to-a-long-random-secret",
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || "7d",
    clientOrigin: process.env.CLIENT_ORIGIN || "http://localhost:3000",
    nodeEnv: process.env.NODE_ENV || "development",
};
//# sourceMappingURL=index.js.map