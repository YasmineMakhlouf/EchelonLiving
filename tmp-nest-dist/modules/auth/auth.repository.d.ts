export declare class AuthRepository {
    private createToken;
    login(email: string, password: string): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        token: string;
    }>;
    register(payload: any): Promise<any>;
}
