import { Controller, Get, Param, Query, UseGuards, Request } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Admin')
@Controller('admin')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AdminController {
  constructor(private adminService: AdminService) {}

  @Get('dashboard/stats')
  @ApiOperation({ summary: 'Get dashboard statistics (today, week, month)' })
  @ApiResponse({ status: 200, description: 'Dashboard stats retrieved' })
  async getDashboardStats() {
    return this.adminService.getDashboardStats();
  }

  @Get('transactions')
  @ApiOperation({ summary: 'Get all transactions with pagination' })
  @ApiResponse({ status: 200, description: 'Transactions retrieved' })
  async getTransactions(@Query('page') page: number = 1, @Query('limit') limit: number = 50) {
    return this.adminService.getTransactionHistory(page, limit);
  }

  @Get('transactions/user/:userId')
  @ApiOperation({ summary: 'Get transactions by specific frontdesk user' })
  @ApiResponse({ status: 200, description: 'User transactions retrieved' })
  async getTransactionsByUser(
    @Param('userId') userId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 50,
  ) {
    return this.adminService.getTransactionsByUser(userId, page, limit);
  }

  @Get('frontdesk/users')
  @ApiOperation({ summary: 'Get all frontdesk users' })
  @ApiResponse({ status: 200, description: 'Frontdesk users retrieved' })
  async getFrontdeskUsers() {
    return this.adminService.getAllFrontdeskUsers();
  }

  @Get('users/:userId/stats')
  @ApiOperation({ summary: 'Get statistics for a specific user' })
  @ApiResponse({ status: 200, description: 'User statistics retrieved' })
  async getUserStats(@Param('userId') userId: string) {
    return this.adminService.getUserStatistics(userId);
  }
}
