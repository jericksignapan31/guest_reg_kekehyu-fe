import { Controller, Post, Get, Body, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { CreateReservationDto } from './dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('Reservations')
@Controller('reservations')
export class ReservationController {
  constructor(private reservationService: ReservationService) {}

  @Post('register')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Register a new guest and create reservation' })
  @ApiResponse({ status: 201, description: 'Reservation created successfully' })
  async createReservation(@Body() createReservationDto: CreateReservationDto, @Request() req) {
    return this.reservationService.createReservation(createReservationDto, req.user.userId);
  }

  @Get('my-bookings')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get all bookings made by the current user' })
  @ApiResponse({ status: 200, description: 'Bookings retrieved successfully' })
  async getMyBookings(@Request() req) {
    return this.reservationService.getReservationsByUser(req.user.userId);
  }

  @Get('/:id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Get reservation details by ID' })
  @ApiResponse({ status: 200, description: 'Reservation details retrieved' })
  async getReservation(@Param('id') id: string) {
    return this.reservationService.getReservationById(id);
  }

  @Get('stats/today')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get today's reservations count" })
  async getTodayStats() {
    const reservations = await this.reservationService.getTodayReservations();
    return { count: reservations.length, reservations };
  }

  @Get('stats/week')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get this week's reservations count" })
  async getWeekStats() {
    const reservations = await this.reservationService.getWeekReservations();
    return { count: reservations.length, reservations };
  }

  @Get('stats/month')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: "Get this month's reservations count" })
  async getMonthStats() {
    const reservations = await this.reservationService.getMonthReservations();
    return { count: reservations.length, reservations };
  }
}
