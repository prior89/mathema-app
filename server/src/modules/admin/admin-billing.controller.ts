import { Controller, Get, Param, Post, Query, UseGuards, UseInterceptors } from '@nestjs/common';
import { RtdnInboxStatus } from '@prisma/client';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { AdminGuard } from '../../common/guards/admin.guard';
import { BillingOpsService } from '../billing/billing-ops.service';
import { AdminAuditInterceptor } from './admin-audit.interceptor';

/** Operator endpoints for Play billing gates (G1/G2) and RTDN inbox triage. */
@UseGuards(JwtAuthGuard, AdminGuard)
@UseInterceptors(AdminAuditInterceptor)
@Controller('admin/billing')
export class AdminBillingController {
  constructor(private readonly ops: BillingOpsService) {}

  @Get('readiness')
  readiness() {
    return this.ops.getReadiness();
  }

  @Get('rtdn-inbox')
  listInbox(
    @Query('status') status?: RtdnInboxStatus,
    @Query('limit') limit?: string,
  ) {
    return this.ops.listInbox({ status, limit: limit ? +limit : undefined });
  }

  @Post('rtdn-inbox/:id/reprocess')
  reprocess(@Param('id') id: string) {
    return this.ops.reprocessInboxRow(id);
  }
}