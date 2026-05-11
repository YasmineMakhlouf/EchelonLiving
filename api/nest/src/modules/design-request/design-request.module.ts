import { Module } from '@nestjs/common';
import { DesignRequestController } from './design-request.controller';
import { DesignRequestService } from './design-request.service';
import { DesignRequestRepository } from './design-request.repository';

@Module({
  controllers: [DesignRequestController],
  providers: [DesignRequestService, DesignRequestRepository],
  exports: [DesignRequestService],
})
export class DesignRequestModule {}
