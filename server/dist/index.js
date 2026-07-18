"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const config_1 = require("./config");
const db_1 = require("./config/db");
const error_1 = require("./middleware/error");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const property_routes_1 = __importDefault(require("./routes/property.routes"));
const inquiry_routes_1 = __importDefault(require("./routes/inquiry.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)({ origin: config_1.config.clientOrigin, credentials: true }));
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/auth", auth_routes_1.default);
app.use("/api/properties", property_routes_1.default);
app.use("/api/inquiries", inquiry_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
app.use(error_1.notFound);
app.use(error_1.errorHandler);
const start = async () => {
    await (0, db_1.connectDB)();
    app.listen(config_1.config.port, () => {
        console.log(`API server listening on http://localhost:${config_1.config.port}`);
    });
};
start();
exports.default = app;
//# sourceMappingURL=index.js.map