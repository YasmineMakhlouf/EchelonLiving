/**
 * users (routes)
 * Defines API endpoints and middleware for users resources.
 */
import { Router } from "express";
import UserController from "../controllers/UserController";
import authMiddleware from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { validateCreateUser, validateUpdateUser } from "../validators/usersValidator";
import asyncHandler from "../middlewares/asyncHandler";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.get("/", authMiddleware, requireAdmin, asyncHandler(UserController.getAll));

router.get("/:id", authMiddleware, requireAdmin, asyncHandler(UserController.getById));

router.post("/", authMiddleware, requireAdmin, validateCreateUser(), validateRequest, asyncHandler(UserController.create));

router.put("/:id", authMiddleware, requireAdmin, validateUpdateUser(), validateRequest, asyncHandler(UserController.update));

router.delete("/:id", authMiddleware, requireAdmin, asyncHandler(UserController.remove));

export default router;

