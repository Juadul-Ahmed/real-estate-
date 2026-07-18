"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const config_1 = require("./config");
const user_model_1 = require("./models/user.model");
const property_model_1 = require("./models/property.model");
const password_1 = require("./utils/password");
dotenv_1.default.config();
async function seed() {
    await mongoose_1.default.connect(config_1.config.mongoUri);
    console.log("Connected. Seeding...");
    await user_model_1.User.deleteMany({});
    await property_model_1.Property.deleteMany({});
    const admin = await user_model_1.User.create({
        name: "Site Admin",
        email: "admin@realestate.com",
        passwordHash: await (0, password_1.hashPassword)("admin123"),
        role: "admin",
        brokerApproved: true,
    });
    const broker = await user_model_1.User.create({
        name: "Jane Broker",
        email: "broker@realestate.com",
        passwordHash: await (0, password_1.hashPassword)("broker123"),
        role: "broker",
        brokerApproved: true,
        phone: "555-0100",
        bio: "Experienced real estate broker.",
    });
    await user_model_1.User.create({
        name: "Bob Buyer",
        email: "buyer@realestate.com",
        passwordHash: await (0, password_1.hashPassword)("buyer123"),
        role: "buyer",
    });
    const sample = [
        {
            title: "Modern Downtown Apartment",
            type: "rent",
            category: "Apartment",
            price: 1800,
            rentPrice: 1800,
            city: "New York",
            address: "12 Broadway",
            bedrooms: 2,
            bathrooms: 1,
            area: 850,
            description: "Bright apartment close to transit.",
            images: ["https://picsum.photos/seed/apt1/600/400"],
            owner: broker._id,
            status: "approved",
            featured: true,
        },
        {
            title: "Suburban Family House",
            type: "sale",
            category: "House",
            price: 450000,
            city: "Austin",
            address: "88 Oak St",
            bedrooms: 4,
            bathrooms: 3,
            area: 2400,
            description: "Spacious family home with garden.",
            images: ["https://picsum.photos/seed/house1/600/400"],
            owner: broker._id,
            status: "approved",
            featured: true,
        },
        {
            title: "Cozy Studio Loft",
            type: "rent",
            category: "Studio",
            price: 1200,
            rentPrice: 1200,
            city: "New York",
            address: "5 Canal St",
            bedrooms: 1,
            bathrooms: 1,
            area: 500,
            description: "Compact studio in lively neighborhood.",
            images: ["https://picsum.photos/seed/loft1/600/400"],
            owner: broker._id,
            status: "pending",
        },
    ];
    await property_model_1.Property.insertMany(sample);
    console.log("Seed complete:");
    console.log("  admin@realestate.com / admin123");
    console.log("  broker@realestate.com / broker123");
    console.log("  buyer@realestate.com / buyer123");
    await mongoose_1.default.disconnect();
}
seed().catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=seed.js.map