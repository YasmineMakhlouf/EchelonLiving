import { OrderRepository } from './order.repository';
export declare class OrderService {
    private readonly repo;
    constructor(repo: OrderRepository);
    getById(id: number): Promise<any>;
    getHistoryForUser(userId: number): Promise<any[]>;
    create(payload: any): Promise<any>;
}
