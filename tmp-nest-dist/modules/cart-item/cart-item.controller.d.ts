import { CartItemService } from './cart-item.service';
export declare class CartItemController {
    private readonly service;
    constructor(service: CartItemService);
    list(userId: string): Promise<any[]>;
    add(body: any): Promise<any>;
    update(id: string, body: any): Promise<any>;
    remove(id: string): Promise<any>;
}
