import { AuthRepository } from './auth.repository';
export declare class AuthService {
    private readonly repo;
    constructor(repo: AuthRepository);
    login(email: string, password: string): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        token: string;
    }>;
    register(payload: any): Promise<any>;
}
