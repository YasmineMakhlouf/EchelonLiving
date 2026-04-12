export type UserRole = "admin" | "customer";

export interface User {
  id: number;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  created_at: Date;
}

export interface IUserCreate {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface IUserLogin {
  email: string;
  password: string;
}

export interface IUserUpdate {
  name?: string;
  email?: string;
  password?: string;
  role?: UserRole;
}
