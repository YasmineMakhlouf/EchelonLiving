import { DesignRequestRepository } from './design-request.repository';
export declare class DesignRequestService {
    private readonly repo;
    constructor(repo: DesignRequestRepository);
    list(): Promise<any[]>;
    create(payload: any): Promise<any>;
    updateStatus(id: number, payload: any): Promise<any>;
}
