/**
 * auth (routes)
 * Defines API endpoints and middleware for auth resources.
 */
import { Router } from "express";
import AuthController from "../controllers/AuthController";
import asyncHandler from "../middlewares/asyncHandler";
import { validateRegister } from "../validators/usersValidator";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.post("/login", asyncHandler(AuthController.login));
router.post("/register", validateRegister(), validateRequest, asyncHandler(AuthController.register));

export default router;

