"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middleware/auth");
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const ctrl = __importStar(require("../controllers/property.controller"));
const router = (0, express_1.Router)();
router.get("/", ctrl.listProperties);
router.get("/:id", ctrl.getProperty);
router.post("/", auth_1.auth, (0, auth_1.roleGuard)("broker"), (0, validate_1.validateBody)(validators_1.propertySchema), ctrl.createProperty);
router.put("/:id", auth_1.auth, (0, auth_1.roleGuard)("broker"), (0, validate_1.validateBody)(validators_1.propertySchema), ctrl.updateProperty);
router.delete("/:id", auth_1.auth, (0, auth_1.roleGuard)("broker"), ctrl.deleteProperty);
router.get("/broker/stats", auth_1.auth, (0, auth_1.roleGuard)("broker"), ctrl.brokerStats);
exports.default = router;
//# sourceMappingURL=property.routes.js.map