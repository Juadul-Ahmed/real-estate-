import { Response } from "express";
import { asyncHandler } from "../middleware/validate";
import { config } from "../config";

export const uploadImage = asyncHandler(async (req: any, res: Response) => {
  const { image } = req.body as { image?: string };
  if (!image || !config.imgbbApiKey) {
    res.status(400).json({ message: "Image data or server config missing" });
    return;
  }

  const form = new URLSearchParams();
  form.append("key", config.imgbbApiKey);
  form.append("image", image);

  const response = await fetch("https://api.imgbb.com/1/upload", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: form.toString(),
  });

  const data = await response.json();
  if (!response.ok || data.success !== true) {
    res.status(400).json({ message: data.error?.message || "ImgBB upload failed" });
    return;
  }

  res.json({ url: data.data.url, deleteUrl: data.data.delete_url });
});
