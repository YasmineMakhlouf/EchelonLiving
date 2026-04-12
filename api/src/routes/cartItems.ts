/**
 * cartItems (routes)
 * Defines API endpoints and middleware for cartItems resources.
 */
import { Router } from "express";
import CartItemController from "../controllers/CartItemController";
import authMiddleware from "../middlewares/authMiddleware";
import asyncHandler from "../middlewares/asyncHandler";

const router = Router();

router.get("/", authMiddleware, asyncHandler(CartItemController.getMyCart));
router.post("/", authMiddleware, asyncHandler(CartItemController.addToCart));
router.put("/:id", authMiddleware, asyncHandler(CartItemController.updateQuantity));
router.delete("/:id", authMiddleware, asyncHandler(CartItemController.removeItem));

export default router;

