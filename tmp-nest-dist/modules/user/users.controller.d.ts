import { UsersService } from './users.service';
export declare class UsersController {
    private readonly service;
    constructor(service: UsersService);
    list(): Promise<any[]>;
    get(id: string): Promise<any>;
}
