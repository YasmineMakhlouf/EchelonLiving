import { Resolver, Mutation, Args } from '@nestjs/graphql';
import { DesignRequest } from '../common/graphql.types';
import { DesignRequestService } from '../modules/design-request/design-request.service';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../modules/auth/jwt-auth.guard';

@Resolver(() => DesignRequest)
export class DesignRequestResolver {
  constructor(private readonly service: DesignRequestService) {}

  @UseGuards(JwtAuthGuard)
  @Mutation(() => DesignRequest)
  async createDesignRequest(
    @Args('userId') userId: number,
    @Args('title') title: string,
    @Args('designDataUrl') designDataUrl: string,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    return this.service.create({ user_id: userId, title, notes, design_data_url: designDataUrl });
  }
}
