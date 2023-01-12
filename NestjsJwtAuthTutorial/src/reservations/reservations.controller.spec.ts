import { Test, TestingModule } from '@nestjs/testing';
import { ReservationsController } from './reservations.controller';
import { ReservationsService } from './reservations.service';

const dummy_id = 'dummy_id'
const dummyRoomId = 'dummy_room_id';
const dummyFromDate = new Date();
const dummyToDate = new Date();
const reservation = {
  room_id: dummyRoomId,
  to: dummyToDate,
  from: dummyFromDate,
  id: String(Math.random()),
};

describe('ReservationsController', () => {
  let controller: ReservationsController;
  const mockReservationService = {
    createReservation: jest.fn().mockImplementation((res) => {
      return {
        id: String(Math.random()),
        ...res,
      };
    }),
    updateReservation: jest.fn().mockImplementation((id,res) => {
      return {
        id,
        ...res,
      };
    }),
    filterReservations: jest.fn().mockImplementation((query) => {
      return Array.from({length:10},(_,i)=>reservation);
    }),
    deleteReservation: jest.fn().mockImplementation((reservation_id) => {
      return {
        reservation
      };
    }),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReservationsController],
      providers: [ReservationsService],
    })
      .overrideProvider(ReservationsService)
      .useValue(mockReservationService)
      .compile();

    controller = module.get<ReservationsController>(ReservationsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create a reservation', () => {
   
    expect(controller.create(reservation)).toEqual({
      ...reservation,
      id: expect.any(String),
    });

    expect(mockReservationService.createReservation).toHaveBeenCalled();
  });
  it('should update a reservation', () => {
   
    expect(controller.update(dummy_id,reservation)).toEqual({
      ...reservation,
    });

    expect(mockReservationService.updateReservation).toHaveBeenCalled();
    expect(mockReservationService.updateReservation).toHaveBeenCalledWith(dummy_id,reservation);

  });

  it('should get reservations', () => {
    controller.findAll()

    expect(mockReservationService.updateReservation).toHaveBeenCalled();
  });

  it('should delete reservations', () => {
    controller.delete(reservation.id)
    
    expect(mockReservationService.deleteReservation).toHaveBeenCalled();
    expect(mockReservationService.deleteReservation).toHaveBeenCalledWith(reservation.id);
  });
});
