import dotenv from "dotenv";
import mongoose from "mongoose";
import { config } from "./config";
import { User } from "./models/user.model";
import { Property } from "./models/property.model";
import { hashPassword } from "./utils/password";

dotenv.config();

async function seed() {
  await mongoose.connect(config.mongoUri);
  console.log("Connected. Seeding...");

  await User.deleteMany({});
  await Property.deleteMany({});

  const admin = await User.create({
    name: "Site Admin",
    email: "admin@realestate.com",
    passwordHash: await hashPassword("admin123"),
    role: "admin",
    brokerApproved: true,
  });

  const broker = await User.create({
    name: "Jane Broker",
    email: "broker@realestate.com",
    passwordHash: await hashPassword("broker123"),
    role: "broker",
    brokerApproved: true,
    phone: "555-0100",
    bio: "Experienced real estate broker.",
  });

  await User.create({
    name: "Bob Buyer",
    email: "buyer@realestate.com",
    passwordHash: await hashPassword("buyer123"),
    role: "buyer",
  });

  const sample = [
    {
      title: "Modern Downtown Apartment",
      type: "rent" as const,
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
      status: "approved" as const,
      featured: true,
    },
    {
      title: "Suburban Family House",
      type: "sale" as const,
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
      status: "approved" as const,
      featured: true,
    },
    {
      title: "Cozy Studio Loft",
      type: "rent" as const,
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
      status: "pending" as const,
    },
  ];

  await Property.insertMany(sample);

  console.log("Seed complete:");
  console.log("  admin@realestate.com / admin123");
  console.log("  broker@realestate.com / broker123");
  console.log("  buyer@realestate.com / buyer123");

  await mongoose.disconnect();
}

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
