/**
 * categories (routes)
 * Defines API endpoints and middleware for categories resources.
 */
import { Router } from "express";
import CategoryController from "../controllers/CategoryController";
import authMiddleware from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/", asyncHandler(CategoryController.getAll));
router.get("/:id", asyncHandler(CategoryController.getById));
router.post("/", authMiddleware, requireAdmin, asyncHandler(CategoryController.create));
router.put("/:id", authMiddleware, requireAdmin, asyncHandler(CategoryController.update));
router.delete("/:id", authMiddleware, requireAdmin, asyncHandler(CategoryController.remove));

export default router;

