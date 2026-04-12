/**
 * UserService
 * Handles user lifecycle operations and password security concerns.
 */
import bcrypt from "bcrypt";
import { IUserCreate, IUserUpdate, User } from "../types/user";
import UserRepository from "../repositories/UserRepository";
import { NotFoundError } from "../utils/errors";

const SALT_ROUNDS = 10;

class UserService {
  static async getAll(): Promise<User[]> {
    return UserRepository.findAll();
  }

  static async getById(id: number): Promise<User> {
    const user = await UserRepository.findById(id);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async create(userData: IUserCreate): Promise<User> {
    // Always hash password before storing new user records.
    const hashedPassword = await bcrypt.hash(userData.password, SALT_ROUNDS);
    return UserRepository.create({
      ...userData,
      password: hashedPassword,
    });
  }

  static async update(id: number, userData: IUserUpdate): Promise<User> {
    const safeUpdateData = { ...userData };

    if (typeof safeUpdateData.password === "string" && safeUpdateData.password.length > 0) {
      safeUpdateData.password = await bcrypt.hash(safeUpdateData.password, SALT_ROUNDS);
    }

    const user = await UserRepository.update(id, safeUpdateData);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    return user;
  }

  static async remove(id: number): Promise<boolean> {
    const deleted = await UserRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError("User not found");
    }
    return deleted;
  }
}

export default UserService;

