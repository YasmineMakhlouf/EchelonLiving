export declare class OrderResolver {
    createOrder(userId: number, total: string, status?: string): Promise<any>;
}
export declare class CartResolver {
    addCartItem(userId: number, productId: number, quantity?: number): Promise<any>;
}
