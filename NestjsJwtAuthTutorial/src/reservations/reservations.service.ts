import { HttpException, Injectable } from '@nestjs/common';
import {
  Between,
  DeleteResult,
  Equal,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ReservationEntity } from './reservation.entity';
import { Reservation, QueryParams } from './reservation.interface';
import { from, Observable } from 'rxjs';
import axios from 'axios';
import { checkIfValidUUID } from '../utils';

@Injectable()
export class ReservationsService {
  constructor(
    @InjectRepository(ReservationEntity)
    private readonly ReservationRepository: Repository<ReservationEntity>,
  ) {}

  async createReservation(reservation: Reservation) {
    const { to, from, room_id } = reservation || {};
    if (new Date(from) > new Date(to)) {
      throw new HttpException('Start date must be before End date', 409);
    }
    try {
      const doesRoomExist = await axios.get(
        `http://localhost:3000/assets/rooms/${room_id}`,
      );
      if (!doesRoomExist) {
        throw new HttpException("Room Doesn't Exist", 404);
      }
    } catch (err) {
      throw new HttpException(err, 404);
    }

    const response = await this.ReservationRepository.find({
      where: [
        {
          room_id: Equal(room_id),
          from: Between(new Date(from), new Date(to)),
        },
        {
          room_id: Equal(room_id),
          to: Between(new Date(from), new Date(to)),
        },
      ],
    });

    if (response.length) {
      throw new HttpException(
        'conflicts with other reservations on the same room',
        409,
      );
    }

    return this.ReservationRepository.save(reservation);
  }

  filterReservations(query: QueryParams): Observable<Reservation[]> {
    const { room_id, before, after } = query || {};

    let filter = {};
    if (room_id) {
      filter = { ...filter, room_id: Equal(room_id) };
    }
    if (before) {
      filter = { ...filter, from: LessThanOrEqual(new Date(before)) };
    }
    if (after) {
      filter = { ...filter, to: MoreThanOrEqual(new Date(after)) };
    }
    return from(
      this.ReservationRepository.find({
        where: filter,
      }),
    );
  }

  async findReservationById(
    reservation_id: string,
  ): Promise<ReservationEntity> {
    if (!checkIfValidUUID(reservation_id)) {
      throw new HttpException('invalid id supplied', 400);
    }

    const response = await this.ReservationRepository.findOneBy({
      id: reservation_id,
    });

    if (!response) {
      throw new HttpException('invalid id supplied', 400);
    }
    return response;
  }

  async updateReservation(reservation_id: string, reservation: Reservation) {
    const { to, from, room_id } = reservation || {};
    if (!checkIfValidUUID(reservation_id)) {
      throw new HttpException('invalid id supplied', 400);
    }

    const existGuard = await this.ReservationRepository.findOneBy({
      id: reservation_id,
    });

    if (!existGuard) {
      throw new HttpException('room not found or mismatching id', 422);
    }

    if (new Date(from) > new Date(to)) {
      throw new HttpException('Start date must be before End date', 409);
    }

    const dateGuard = await this.ReservationRepository.find({
      where: [
        {
          room_id: Equal(room_id),
          from: Between(new Date(from), new Date(to)),
        },
        {
          room_id: Equal(room_id),
          to: Between(new Date(from), new Date(to)),
        },
      ],
    });

    if (dateGuard.length) {
      throw new HttpException(
        'conflicts with other reservations on the same room',
        409,
      );
    }
    return this.ReservationRepository.update(reservation_id, reservation);
  }

  async deleteReservation(
    reservation_id: string,
  ): Promise<Observable<DeleteResult>> {
    if (!checkIfValidUUID(reservation_id)) {
      throw new HttpException('invalid id supplied', 400);
    }
    const response = await this.ReservationRepository.findOneBy({
      id: reservation_id,
    });

    if (!response) {
      throw new HttpException('not found', 404);
    }

    await this.ReservationRepository.delete({
      id: reservation_id,
    });

    return;
  }
}
