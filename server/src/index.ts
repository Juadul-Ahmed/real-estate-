import express from "express";
import cors from "cors";
import { config } from "./config";
import { connectDB } from "./config/db";
import { errorHandler, notFound } from "./middleware/error";
import authRoutes from "./routes/auth.routes";
import propertyRoutes from "./routes/property.routes";
import inquiryRoutes from "./routes/inquiry.routes";
import adminRoutes from "./routes/admin.routes";
import chatRoutes from "./routes/chat.routes";
import uploadRoutes from "./routes/upload.routes";

const app = express();

app.use(cors({ origin: config.clientOrigin, credentials: true }));
app.use(express.json({ limit: "10mb" }));

app.get("/api/health", (_req, res) => res.json({ status: "ok" }));
app.use("/api/chat", chatRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/properties", propertyRoutes);
app.use("/api/inquiries", inquiryRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/upload", uploadRoutes);

app.use(notFound);
app.use(errorHandler);

const start = async () => {
  await connectDB();
  app.listen(config.port, () => {
    console.log(`API server listening on http://localhost:${config.port}`);
  });
};

start();

export default app;
