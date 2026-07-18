import { Request, Response, NextFunction } from "express";

export function errorHandler(err: any, _req: Request, res: Response, _next: NextFunction): void {
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({ message: err.message || "Internal server error" });
}

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ message: "Route not found" });
}
