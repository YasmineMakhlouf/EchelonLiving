/**
 * productsValidator
 * Validation chains for product creation and partial updates.
 */
import { body, ValidationChain } from "express-validator";

export const validateCreateProduct = (): ValidationChain[] => [
  body("name").notEmpty().withMessage("Name is required").isString().trim(),
  body("description").notEmpty().withMessage("Description is required").isString().trim(),
  body("price").notEmpty().withMessage("Price is required").isFloat({ gt: 0 }),
  body("color").notEmpty().withMessage("Color is required").isString().trim(),
  body("size").notEmpty().withMessage("Size is required").isString().trim(),
  // Stock can be zero (out of stock), but never negative.
  body("stock_quantity").notEmpty().withMessage("Stock quantity is required").isInt({ min: 0 }),
  body("category_id").notEmpty().withMessage("Category id is required").isInt({ min: 1 }),
];

export const validateUpdateProduct = (): ValidationChain[] => [
  body("name").optional().isString().trim(),
  body("description").optional().isString().trim(),
  body("price").optional().isFloat({ gt: 0 }),
  body("color").optional().isString().trim(),
  body("size").optional().isString().trim(),
  body("stock_quantity").optional().isInt({ min: 0 }),
  body("category_id").optional().isInt({ min: 1 }),
];

