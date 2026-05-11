import { ReviewRepository } from './review.repository';
export declare class ReviewService {
    private readonly repo;
    constructor(repo: ReviewRepository);
    listForProduct(productId: number): Promise<any[]>;
}
