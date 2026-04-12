import { describe, expect, it } from "vitest";
import { AppError, BadRequestError, ConflictError, ForbiddenError, NotFoundError, UnauthorizedError, ValidationError } from "./errors";

describe("custom error classes", () => {
  it("creates AppError with status and optional details", () => {
    const error = new AppError("Boom", 418, { hint: "teapot" });

    expect(error.message).toBe("Boom");
    expect(error.status).toBe(418);
    expect(error.details).toEqual({ hint: "teapot" });
    expect(error.name).toBe("AppError");
  });

  it("creates typed http errors with expected statuses", () => {
    expect(new BadRequestError().status).toBe(400);
    expect(new UnauthorizedError().status).toBe(401);
    expect(new ForbiddenError().status).toBe(403);
    expect(new NotFoundError().status).toBe(404);
    expect(new ConflictError().status).toBe(409);
  });

  it("attaches field-level validation details", () => {
    const error = new ValidationError("Validation failed", {
      email: "Invalid email",
      password: "Too short",
    });

    expect(error.status).toBe(400);
    expect(error.details).toEqual({
      email: "Invalid email",
      password: "Too short",
    });
  });
});