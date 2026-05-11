import { ProductService } from './product.service';
import { ProductImageService } from '../product-image/product-image.service';
export declare class ProductController {
    private readonly service;
    private readonly productImageService;
    constructor(service: ProductService, productImageService: ProductImageService);
    list(query: Record<string, string>): Promise<any[]>;
    getImages(id: string): Promise<any[]>;
    get(id: string): Promise<any>;
}
