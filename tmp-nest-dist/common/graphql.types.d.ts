export declare class Product {
    id: number;
    name: string;
    price: string;
    description?: string;
}
export declare class Category {
    id: number;
    name: string;
}
export declare class User {
    id: number;
    email: string;
    role: string;
}
export declare class AuthPayload {
    id: number;
    email: string;
    role: string;
    token?: string;
}
export declare class Order {
    id: number;
    userId: number;
    total: string;
    status: string;
}
export declare class CartItem {
    id: number;
    userId: number;
    productId: number;
    quantity: number;
}
