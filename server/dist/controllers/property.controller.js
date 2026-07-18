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
exports.brokerStats = exports.setPropertyStatus = exports.deleteProperty = exports.updateProperty = exports.createProperty = exports.getProperty = exports.listProperties = void 0;
const validate_1 = require("../middleware/validate");
const validators_1 = require("../validators");
const property_model_1 = require("../models/property.model");
function populateOwner(query) {
    return query.populate("owner", "name email phone avatar brokerApproved");
}
exports.listProperties = (0, validate_1.asyncHandler)(async (req, res) => {
    const { type, city, category, minPrice, maxPrice, bedrooms, q, status, owner } = req.query;
    const filter = {};
    if (type)
        filter.type = type;
    if (city)
        filter.city = new RegExp(city, "i");
    if (category)
        filter.category = new RegExp(category, "i");
    if (owner)
        filter.owner = owner;
    if (status)
        filter.status = status;
    if (bedrooms)
        filter.bedrooms = { $gte: Number(bedrooms) };
    if (minPrice || maxPrice) {
        filter.price = {};
        if (minPrice)
            filter.price.$gte = Number(minPrice);
        if (maxPrice)
            filter.price.$lte = Number(maxPrice);
    }
    if (q)
        filter.$text = { $search: q };
    const properties = await populateOwner(property_model_1.Property.find(filter).sort({ createdAt: -1 }));
    res.json({ properties });
});
exports.getProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await populateOwner(property_model_1.Property.findById(req.params.id));
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }
    res.json({ property });
});
exports.createProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.propertySchema.parse(req.body);
    const property = await property_model_1.Property.create({ ...data, owner: req.user.id });
    res.status(201).json({ property });
});
exports.updateProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const data = validators_1.propertySchema.parse(req.body);
    const property = await property_model_1.Property.findOneAndUpdate({ _id: req.params.id, owner: req.user.id }, data, { new: true });
    if (!property) {
        res.status(404).json({ message: "Property not found or not owned by you" });
        return;
    }
    res.json({ property });
});
exports.deleteProperty = (0, validate_1.asyncHandler)(async (req, res) => {
    const property = await property_model_1.Property.findOneAndDelete({ _id: req.params.id, owner: req.user.id });
    if (!property) {
        res.status(404).json({ message: "Property not found or not owned by you" });
        return;
    }
    res.json({ message: "Deleted" });
});
exports.setPropertyStatus = (0, validate_1.asyncHandler)(async (req, res) => {
    const { status } = req.body;
    const property = await property_model_1.Property.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!property) {
        res.status(404).json({ message: "Property not found" });
        return;
    }
    res.json({ property });
});
exports.brokerStats = (0, validate_1.asyncHandler)(async (req, res) => {
    const owner = req.user.id;
    const [total, pending, approved, inquiries] = await Promise.all([
        property_model_1.Property.countDocuments({ owner }),
        property_model_1.Property.countDocuments({ owner, status: "pending" }),
        property_model_1.Property.countDocuments({ owner, status: "approved" }),
        Inquiry_count(owner),
    ]);
    res.json({ total, pending, approved, inquiries });
});
async function Inquiry_count(owner) {
    const props = await property_model_1.Property.find({ owner }, "_id");
    const ids = props.map((p) => p._id);
    const { Inquiry } = await Promise.resolve().then(() => __importStar(require("../models/inquiry.model")));
    return Inquiry.countDocuments({ property: { $in: ids } });
}
//# sourceMappingURL=property.controller.js.map