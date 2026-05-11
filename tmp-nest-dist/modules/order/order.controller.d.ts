import { OrderService } from './order.service';
export declare class OrderController {
    private readonly service;
    constructor(service: OrderService);
    history(userId: string): Promise<any[]>;
    get(id: string): Promise<any>;
    create(body: any): Promise<any>;
}
