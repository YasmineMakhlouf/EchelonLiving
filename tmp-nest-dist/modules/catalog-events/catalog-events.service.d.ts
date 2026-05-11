import { CatalogEventsRepository } from './catalog-events.repository';
export declare class CatalogEventsService {
    private readonly repo;
    constructor(repo: CatalogEventsRepository);
    list(): Promise<any[]>;
}
