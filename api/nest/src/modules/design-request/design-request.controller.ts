import { Body, Controller, Get, Param, Patch, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { DesignRequestService } from './design-request.service';

@Controller('design-requests')
export class DesignRequestController {
  constructor(private readonly service: DesignRequestService) {}

  @Get()
  async list() {
    return this.service.list();
  }

  @Post()
  async create(@Body() body: any) {
    return this.service.create(body);
  }

  @Patch(':id')
  async updateStatus(@Param('id') id: string, @Body() body: any, @Res() res: Response) {
    const updated = await this.service.updateStatus(Number(id), body);
    if (!updated) {
      return res.status(404).json({ message: 'Design request not found' });
    }

    return res.json(updated);
  }
}
