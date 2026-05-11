import type { Response } from 'express';
import { CatalogEventsService } from './catalog-events.service';
export declare class CatalogEventsController {
    private readonly service;
    constructor(service: CatalogEventsService);
    stream(res: Response): Promise<void>;
}
