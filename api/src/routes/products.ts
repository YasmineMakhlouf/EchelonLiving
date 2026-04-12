/**
 * products (routes)
 * Defines API endpoints and middleware for products resources.
 */
import { Router } from "express";
import ProductController from "../controllers/ProductController";
import { validateCreateProduct, validateUpdateProduct } from "../validators/productsValidator";
import authMiddleware from "../middlewares/authMiddleware";
import { requireAdmin } from "../middlewares/roleMiddleware";
import { productImageUpload } from "../middlewares/uploadMiddleware";
import asyncHandler from "../middlewares/asyncHandler";
import validateRequest from "../middlewares/validateRequest";

const router = Router();

router.get("/", asyncHandler(ProductController.getAll));
router.get("/:id", asyncHandler(ProductController.getById));
router.get("/:id/images", asyncHandler(ProductController.getImages));
router.post("/", authMiddleware, requireAdmin, validateCreateProduct(), validateRequest, asyncHandler(ProductController.create));
router.post("/:id/images", authMiddleware, requireAdmin, productImageUpload.single("image"), asyncHandler(ProductController.uploadImage));
router.put("/:id", authMiddleware, requireAdmin, validateUpdateProduct(), validateRequest, asyncHandler(ProductController.update));
router.delete("/:id", authMiddleware, requireAdmin, asyncHandler(ProductController.remove));

export default router;

