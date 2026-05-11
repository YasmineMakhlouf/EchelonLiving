import { ProductImageRepository } from './product-image.repository';
export declare class ProductImageService {
    private readonly repo;
    constructor(repo: ProductImageRepository);
    listForProduct(productId: number): Promise<any[]>;
}
