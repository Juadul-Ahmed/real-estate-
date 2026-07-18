"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = errorHandler;
exports.notFound = notFound;
function errorHandler(err, _req, res, _next) {
    console.error(err);
    const status = err.status || 500;
    res.status(status).json({ message: err.message || "Internal server error" });
}
function notFound(_req, res) {
    res.status(404).json({ message: "Route not found" });
}
//# sourceMappingURL=error.js.map