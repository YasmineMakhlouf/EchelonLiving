import { AdminStatsRepository } from './admin-stats.repository';
export declare class AdminStatsService {
    private readonly repo;
    constructor(repo: AdminStatsRepository);
    getSummary(): Promise<{
        total_users: any;
        total_orders: any;
        top_selling_products: any[];
    }>;
}
