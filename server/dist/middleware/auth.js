"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.roleGuard = roleGuard;
const jwt_1 = require("../utils/jwt");
function auth(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "Authentication required" });
        return;
    }
    try {
        const token = header.split(" ")[1];
        req.user = (0, jwt_1.verifyToken)(token);
        next();
    }
    catch {
        res.status(401).json({ message: "Invalid or expired token" });
    }
}
function roleGuard(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            res.status(403).json({ message: "Forbidden: insufficient role" });
            return;
        }
        next();
    };
}
//# sourceMappingURL=auth.js.map