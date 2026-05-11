export declare class ProductResolver {
    products(): Promise<any[]>;
    product(id: number): Promise<any>;
    categories(): Promise<any[]>;
    productsByCategory(categoryId: number): Promise<any[]>;
}
