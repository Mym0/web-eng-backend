import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ReservationsService } from './reservations.service';
import { ReservationEntity } from './reservation.entity';

describe('ReservationsService', () => {
  let service: ReservationsService;

  const mockReservationRepository = {};

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReservationsService,
        {
          provide: getRepositoryToken(ReservationEntity),
          useValue: mockReservationRepository,
        },
      ],
    }).compile();

    service = module.get<ReservationsService>(ReservationsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // it('should create reservation', () => {
  //   // Arrange
  //   service.tweets = [];
  //   const payload = 'This is my tweet';

  //   // Act
  //   const tweet = service.createTweet(payload);

  //   // Assert
  //   expect(tweet).toBe(payload);
  //   expect(service.tweets).toHaveLength(1);
  // });


});
