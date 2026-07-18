export type Role = "buyer" | "broker" | "admin";

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
  phone?: string;
  avatar?: string;
  bio?: string;
  brokerApproved: boolean;
  favorites?: string[];
  createdAt?: string;
}

export interface Property {
  _id: string;
  title: string;
  type: "rent" | "sale";
  category: string;
  price: number;
  rentPrice?: number;
  city: string;
  address: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  description: string;
  images: string[];
  owner: { _id: string; name: string; email: string; phone?: string; avatar?: string; brokerApproved?: boolean } | string;
  status: "pending" | "approved" | "rejected";
  featured: boolean;
  createdAt: string;
}

export interface Inquiry {
  _id: string;
  property: Property | string;
  buyer: User | string;
  broker: User | string;
  message: string;
  status: "open" | "answered" | "closed";
  createdAt: string;
}

export interface Message {
  _id: string;
  inquiry: string;
  sender: { _id: string; name: string; role: Role; avatar?: string } | string;
  text: string;
  createdAt: string;
}

export interface PaginatedProperties {
  properties: Property[];
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

interface AnalyticsData {
  users: number; buyers: number; brokers: number; admins: number;
  properties: number; approved: number; pending: number; rejected: number;
  inquiries: number; messages: number;
  trends: {
    labels: string[];
    users: { date: string; count: number }[];
    properties: { date: string; count: number }[];
    inquiries: { date: string; count: number }[];
  };
}

export interface AuthResponse {
  token: string;
  user: User;
}
