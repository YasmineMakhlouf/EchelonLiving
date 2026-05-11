import { Controller, Get, Res } from '@nestjs/common';
import type { Response } from 'express';
import { CatalogEventsService } from './catalog-events.service';

@Controller('events')
export class CatalogEventsController {
  constructor(private readonly service: CatalogEventsService) {}

  @Get()
  async stream(@Res() res: Response) {
    res.status(200);
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.flushHeaders?.();

    res.write('event: catalog-change\n');
    res.write('data: {"scope":"all"}\n\n');

    const keepAlive = setInterval(() => {
      res.write(': ping\n\n');
    }, 30000);

    res.on('close', () => {
      clearInterval(keepAlive);
      res.end();
    });
  }
}
