import { ProductImageService } from './product-image.service';
export declare class ProductImageController {
    private readonly service;
    constructor(service: ProductImageService);
    list(productId: string): Promise<any[]>;
}
