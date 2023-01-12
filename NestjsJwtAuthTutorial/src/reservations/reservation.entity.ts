import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { IsString, IsNotEmpty, IsDate } from 'class-validator';

@Entity('reservations')
export class ReservationEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  @IsDate()
  @IsNotEmpty()
  from: Date;

  @Column()
  @IsDate()
  @IsNotEmpty()
  to: Date;

  @Column()
  @IsString()
  @IsNotEmpty()
  room_id: string;
}
