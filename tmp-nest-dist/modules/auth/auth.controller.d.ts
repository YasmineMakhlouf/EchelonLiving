import { AuthService } from './auth.service';
export declare class AuthController {
    private readonly service;
    constructor(service: AuthService);
    login(body: any): Promise<{
        id: any;
        name: any;
        email: any;
        role: any;
        token: string;
    }>;
    register(body: any): Promise<any>;
}
