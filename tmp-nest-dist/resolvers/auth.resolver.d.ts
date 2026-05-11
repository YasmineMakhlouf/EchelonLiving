export declare class AuthResolver {
    login(email: string, password: string): Promise<{
        id: any;
        email: any;
        role: any;
        token: string;
    }>;
    register(email: string, password: string, role?: string): Promise<{
        id: any;
        email: any;
        role: any;
    }>;
}
