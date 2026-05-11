import { Response } from 'express';
import { DesignRequestService } from './design-request.service';
export declare class DesignRequestController {
    private readonly service;
    constructor(service: DesignRequestService);
    list(): Promise<any[]>;
    create(body: any): Promise<any>;
    updateStatus(id: string, body: any, res: Response): Promise<Response<any, Record<string, any>>>;
}
