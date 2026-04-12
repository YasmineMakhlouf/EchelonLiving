import { describe, expect, it, vi } from "vitest";

vi.mock("./axios", () => {
  return {
    default: {
      defaults: {
        baseURL: "http://localhost:5000/api/v1",
      },
    },
  };
});

import { toAbsoluteImageUrl } from "./image";

describe("toAbsoluteImageUrl", () => {
  it("returns empty string for empty input", () => {
    expect(toAbsoluteImageUrl("")).toBe("");
    expect(toAbsoluteImageUrl(undefined)).toBe("");
    expect(toAbsoluteImageUrl(null)).toBe("");
  });

  it("keeps already absolute URLs unchanged", () => {
    expect(toAbsoluteImageUrl("https://cdn.example.com/image.png")).toBe("https://cdn.example.com/image.png");
    expect(toAbsoluteImageUrl("http://cdn.example.com/image.png")).toBe("http://cdn.example.com/image.png");
  });

  it("prepends backend host for relative image paths", () => {
    expect(toAbsoluteImageUrl("uploads/products/item.png")).toBe("http://localhost:5000/uploads/products/item.png");
    expect(toAbsoluteImageUrl("/uploads/products/item.png")).toBe("http://localhost:5000/uploads/products/item.png");
  });
});