/**
 * designRequestsValidator
 * Validation chains for creating and reviewing custom design requests.
 */
import { body } from "express-validator";

export const createDesignRequestValidator = [
  body("title").notEmpty().withMessage("Title is required").isString().trim(),
  // Drawing payload is expected as a base64 data URL from the client canvas.
  body("designDataUrl")
    .notEmpty()
    .withMessage("Drawing is required")
    .isString()
    .custom((value) => value.startsWith("data:image/"))
    .withMessage("Drawing must be a valid image data URL"),
  body("notes").optional().isString().trim(),
];

export const updateDesignRequestValidator = [
  // Restrict status to known review states used by admin workflows.
  body("status")
    .notEmpty()
    .withMessage("Status is required")
    .isIn(["pending", "approved", "rejected"])
    .withMessage("Status must be pending, approved, or rejected"),
  body("adminNotes").optional().isString().trim(),
];

