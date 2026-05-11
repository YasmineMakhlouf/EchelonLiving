import { Module } from '@nestjs/common';
import { CatalogEventsController } from './catalog-events.controller';
import { CatalogEventsService } from './catalog-events.service';
import { CatalogEventsRepository } from './catalog-events.repository';

@Module({
  controllers: [CatalogEventsController],
  providers: [CatalogEventsService, CatalogEventsRepository],
  exports: [CatalogEventsService],
})
export class CatalogEventsModule {}
