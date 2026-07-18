export type Role = "buyer" | "broker" | "admin";

export interface JwtPayload {
  id: string;
  role: Role;
}
