import { CategoryRepository } from './category.repository';
export declare class CategoryService {
    private readonly repo;
    constructor(repo: CategoryRepository);
    list(): Promise<any[]>;
}
