import { AdminStatsService } from './admin-stats.service';
export declare class AdminStatsController {
    private readonly service;
    constructor(service: AdminStatsService);
    getStats(): Promise<{
        total_users: any;
        total_orders: any;
        top_selling_products: any[];
    }>;
}
