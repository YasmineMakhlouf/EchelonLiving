/**
 * UserController
 * Handles user CRUD endpoints (typically admin-protected by routing middleware).
 */
import { Request, Response } from "express";
import UserService from "../services/UserService";

class UserController {
  static async getAll(req: Request, res: Response): Promise<void> {
    const users = await UserService.getAll();
    res.json(users);
  }

  static async getById(req: Request, res: Response): Promise<void> {
    // Convert URL id to number for typed service/repository calls.
    const id = Number(req.params.id);
    const user = await UserService.getById(id);
    res.json(user);
  }

  static async create(req: Request, res: Response): Promise<void> {
    const user = await UserService.create(req.body);
    res.status(201).json(user);
  }

  static async update(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    const user = await UserService.update(id, req.body);
    res.json(user);
  }

  static async remove(req: Request, res: Response): Promise<void> {
    const id = Number(req.params.id);
    await UserService.remove(id);
    res.status(204).send();
  }
}

export default UserController;

