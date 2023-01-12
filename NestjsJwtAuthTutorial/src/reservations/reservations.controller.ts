import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { DeleteResult, UpdateResult } from 'typeorm';
import { ReservationEntity } from './reservation.entity';
import { QueryParams, Reservation } from './reservation.interface';
import { ReservationsService } from './reservations.service';

@Controller('reservations')
export class ReservationsController {
  constructor(private reservationsService: ReservationsService) {}
  @UseGuards(JwtAuthGuard)
  @Post()
  create(
    @Body() reservation: Reservation,
  ): Promise<Reservation & ReservationEntity> {
    return this.reservationsService.createReservation(reservation);
  }

  @Get()
  findAll(@Query() query?: QueryParams): Observable<Reservation[]> {
    return this.reservationsService.filterReservations(query);
  }

  @Get(':reservation_id')
  findById(
    @Param('reservation_id') reservation_id: string,
  ): Promise<ReservationEntity> {
    return this.reservationsService.findReservationById(reservation_id);
  }

  @UseGuards(JwtAuthGuard)
  @Put(':reservation_id')
  update(
    @Param('reservation_id') reservation_id: string,
    @Body() reservation: Reservation,
  ): Promise<UpdateResult> {
    return this.reservationsService.updateReservation(
      reservation_id,
      reservation,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':reservation_id')
  delete(
    @Param('reservation_id') reservation_id: string,
  ): Promise<Observable<DeleteResult>> {
    return this.reservationsService.deleteReservation(reservation_id);
  }
}
