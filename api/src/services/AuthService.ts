/**
 * AuthService
 * Handles login and registration business rules.
 */
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import UserRepository from "../repositories/UserRepository";
import { IUserLogin, IUserCreate, User } from "../types/user";
import { env } from "../config/env";
import { ConflictError, UnauthorizedError } from "../utils/errors";

class AuthService {
  static async login({ email, password }: IUserLogin): Promise<string> {
    const user = await UserRepository.findByEmail(email);
    if (!user) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Compare plaintext credential against stored bcrypt hash.
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new UnauthorizedError("Invalid email or password");
    }

    // Token includes identity and role for downstream auth middleware.
    const token = jwt.sign({ id: user.id, role: user.role }, env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return token;
  }

  static async register(userData: IUserCreate): Promise<Omit<User, 'password'>> {
    const existingUser = await UserRepository.findByEmail(userData.email);
    if (existingUser) {
      throw new ConflictError("Email already in use");
    }

    // Hash password before persistence; never store raw credentials.
    const hashedPassword = await bcrypt.hash(userData.password, 10);
    const createdUser = await UserRepository.create({
      ...userData,
      role: "customer",
      password: hashedPassword,
    });

    const { password, ...userWithoutPassword } = createdUser;
    return userWithoutPassword;
  }
}

export default AuthService;

