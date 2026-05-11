import { UsersRepository } from './users.repository';
export declare class UsersService {
    private readonly repo;
    constructor(repo: UsersRepository);
    list(): Promise<any[]>;
    getById(id: number): Promise<any>;
}
