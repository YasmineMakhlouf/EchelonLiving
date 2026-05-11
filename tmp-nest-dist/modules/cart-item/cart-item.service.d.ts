import { CartItemRepository } from './cart-item.repository';
export declare class CartItemService {
    private readonly repo;
    constructor(repo: CartItemRepository);
    listForUser(userId: number): Promise<any[]>;
    add(payload: any): Promise<any>;
    update(id: number, quantity: number): Promise<any>;
    remove(id: number): Promise<any>;
}
