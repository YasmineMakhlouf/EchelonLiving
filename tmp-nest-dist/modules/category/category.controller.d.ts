import { CategoryService } from './category.service';
export declare class CategoryController {
    private readonly service;
    constructor(service: CategoryService);
    list(): Promise<any[]>;
}
