import { Injectable } from '@nestjs/common';
import { CatalogEventsRepository } from './catalog-events.repository';

@Injectable()
export class CatalogEventsService {
  constructor(private readonly repo: CatalogEventsRepository) {}

  async list() {
    return this.repo.query('SELECT id, title, description, date FROM catalog_events ORDER BY date DESC');
  }
}
