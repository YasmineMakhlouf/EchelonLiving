/**
 * usersValidator
 * Validation chains for auth registration and user CRUD payloads.
 */
import { body, ValidationChain } from "express-validator";

export const validateRegister = (): ValidationChain[] => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  // Minimum password length baseline; hashing/strength policies are enforced elsewhere.
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
];

export const validateCreateUser = (): ValidationChain[] => [
  body("name")
    .notEmpty()
    .withMessage("Name is required")
    .isString()
    .trim(),
  body("email")
    .notEmpty()
    .withMessage("Email is required")
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .notEmpty()
    .withMessage("Password is required")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .notEmpty()
    .withMessage("Role is required")
    .isIn(["admin", "customer"])
    .withMessage("Role must be admin or customer")
    .isString()
    .trim(),
];

export const validateUpdateUser = (): ValidationChain[] => [
  body("name")
    .optional()
    .isString()
    .trim(),
  body("email")
    .optional()
    .isEmail()
    .withMessage("Email must be valid")
    .normalizeEmail(),
  body("password")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters"),
  body("role")
    .optional()
    .isIn(["admin", "customer"])
    .withMessage("Role must be admin or customer")
    .isString()
    .trim(),
];

