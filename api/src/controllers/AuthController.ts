/**
 * AuthController
 * Handles authentication endpoints such as login and account registration.
 */
import { NextFunction, Request, Response } from "express";
import AuthService from "../services/AuthService";

class AuthController {
  static async login(req: Request, res: Response, next: NextFunction): Promise<void> {
    // AuthService validates credentials and returns a signed access token.
    const token = await AuthService.login(req.body);
    res.json({ token });
  }

  static async register(req: Request, res: Response, next: NextFunction): Promise<void> {
    // Registration persists a new user after payload validation in middleware.
    const user = await AuthService.register(req.body);
    res.status(201).json(user);
  }
}

export default AuthController;

