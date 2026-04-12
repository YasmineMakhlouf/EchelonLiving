/**
 * ProductImageService
 * Validates product existence and manages product image records.
 */
import ProductImageRepository from "../repositories/ProductImageRepository";
import ProductRepository from "../repositories/ProductRepository";
import { ProductImage } from "../types/productImage";
import { NotFoundError } from "../utils/errors";

class ProductImageService {
  static async addImage(productId: number, imageUrl: string): Promise<ProductImage> {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return ProductImageRepository.create(productId, imageUrl);
  }

  static async getByProductId(productId: number): Promise<ProductImage[]> {
    const product = await ProductRepository.findById(productId);
    if (!product) {
      throw new NotFoundError("Product not found");
    }

    return ProductImageRepository.findByProductId(productId);
  }
}

export default ProductImageService;

