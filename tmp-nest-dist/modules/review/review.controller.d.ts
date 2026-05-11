import { ReviewService } from './review.service';
export declare class ReviewController {
    private readonly service;
    constructor(service: ReviewService);
    list(productId: string): Promise<any[]>;
}
