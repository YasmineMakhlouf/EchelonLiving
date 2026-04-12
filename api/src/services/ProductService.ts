/**
 * ProductService
 * Coordinates product catalog use cases and validation boundaries.
 */
import ProductRepository from "../repositories/ProductRepository";
import { IProductCreate, IProductUpdate, Product, ProductWithReviews } from "../types/product";
import { NotFoundError } from "../utils/errors";

interface ProductQueryOptions {
  page?: number | string;
  limit?: number | string;
  category_id?: number | string;
  categoryId?: number | string;
  min_price?: number | string;
  minPrice?: number | string;
  max_price?: number | string;
  maxPrice?: number | string;
  color?: string;
  size?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: string;
}

class ProductService {
  static async getAll(filters: ProductQueryOptions = {}): Promise<Product[]> {
    return ProductRepository.findAll(filters);
  }

  static async getById(id: number): Promise<Product> {
    const product = await ProductRepository.findById(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  static async getProductWithReviews(id: number): Promise<ProductWithReviews> {
    const product = await ProductRepository.findByIdWithReviews(id);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  static async getRecommended(userId: number): Promise<Product[]> {
    const safeUserId = Number(userId);
    // Invalid user ids yield no recommendations instead of throwing.
    if (Number.isNaN(safeUserId) || safeUserId <= 0) {
      return [];
    }

    return ProductRepository.findRecommendedByUser(safeUserId, 10);
  }

  static async create(productData: IProductCreate): Promise<Product> {
    return ProductRepository.create(productData);
  }

  static async update(id: number, productData: IProductUpdate): Promise<Product> {
    const product = await ProductRepository.update(id, productData);
    if (!product) {
      throw new NotFoundError("Product not found");
    }
    return product;
  }

  static async remove(id: number): Promise<boolean> {
    const deleted = await ProductRepository.remove(id);
    if (!deleted) {
      throw new NotFoundError("Product not found");
    }
    return deleted;
  }
}

export default ProductService;

