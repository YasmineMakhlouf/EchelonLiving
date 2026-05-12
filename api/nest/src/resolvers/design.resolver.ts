import { Resolver, Mutation, Args, Int } from '@nestjs/graphql';
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
    @Args('userId', { type: () => Int }) userId: number,
    @Args('title') title: string,
    @Args('designDataUrl') designDataUrl: string,
    @Args('notes', { nullable: true }) notes?: string,
  ) {
    const created = await this.service.create({ user_id: userId, title, notes, design_data_url: designDataUrl });
    return {
      id: created.id,
      userId: created.user_id,
      title: created.title,
      notes: created.notes,
      designDataUrl: created.design_data_url,
      status: created.status,
      adminNotes: created.admin_notes,
      createdAt: created.created_at?.toISOString?.() ?? String(created.created_at),
      reviewedAt: created.reviewed_at ? (created.reviewed_at.toISOString?.() ?? String(created.reviewed_at)) : null,
    };
  }
}
