import { ProductRepository } from './product.repository';
type ProductQueryOptions = {
    page?: string | number;
    limit?: string | number;
    category_id?: string | number;
    categoryId?: string | number;
    min_price?: string | number;
    minPrice?: string | number;
    max_price?: string | number;
    maxPrice?: string | number;
    color?: string;
    size?: string;
    search?: string;
    sortBy?: string;
    sortOrder?: string;
};
export declare class ProductService {
    private readonly repo;
    constructor(repo: ProductRepository);
    list(filters?: ProductQueryOptions): Promise<any[]>;
    getById(id: number): Promise<any>;
}
export {};
