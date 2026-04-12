/**
 * reviews (routes)
 * Defines API endpoints and middleware for reviews resources.
 */
import { Router } from "express";
import ReviewController from "../controllers/ReviewController";
import asyncHandler from "../middlewares/asyncHandler";
import authMiddleware from "../middlewares/authMiddleware";

const router = Router();

router.get("/", asyncHandler(ReviewController.getAll));
router.get("/:id", asyncHandler(ReviewController.getById));
router.post("/", authMiddleware, asyncHandler(ReviewController.create));
router.put("/:id", authMiddleware, asyncHandler(ReviewController.update));
router.delete("/:id", authMiddleware, asyncHandler(ReviewController.remove));

export default router;

