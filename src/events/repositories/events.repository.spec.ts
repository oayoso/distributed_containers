import { EventsRepository } from './events.repository';
import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { CreateEventDto } from '../dtos/create-event.dto';

describe('EventsRepository', () => {
  let repository: EventsRepository;
  let eventModel: any;

  beforeEach(async () => {
    eventModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      aggregate: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsRepository,
        {
          provide: getModelToken('Event'),
          useValue: eventModel,
        },
      ],
    }).compile();

    repository = module.get<EventsRepository>(EventsRepository);
  });

  describe('create', () => {
    it('should add a new status to an existing container', async () => {
        // PREPARE
        const mockExisting = {
            statusHistory: [],
            save: jest.fn(),
        };

        eventModel.findOne.mockResolvedValue(mockExisting);

        const dto: CreateEventDto = {
            containerId: 'ACBD123',
            state: 'operational',
            timestamp: "2025-04-23T00:12:45.625Z",
            source: "sensor_x",
        };

        // EXECUTE
        await repository.create(dto);

        // VALIDATE
        expect(eventModel.findOne).toHaveBeenCalledWith({ containerId: 'ACBD123' });
        expect(mockExisting.save).toHaveBeenCalled();
        expect(mockExisting.statusHistory.length).toBe(1);
    });

    it('should create a new container if not exists', async () => {
        // PREPARE
        eventModel.findOne.mockResolvedValue(null);
        eventModel.create.mockResolvedValue(undefined);

        const dto: CreateEventDto = {
            containerId: 'xyz789',
            state: 'inactive',
            timestamp: new Date().toISOString(),
            source: 'manual',
        };

        // EXECUTE
        await repository.create(dto);

        // VALIDATE
        expect(eventModel.create).toHaveBeenCalledWith({
            containerId: 'xyz789',
            statusHistory: [
            {
                state: dto.state,
                timestamp: new Date(dto.timestamp),
                source: dto.source,
            },
            ],
        });
    });
  });

  describe('findLastThreeStatusById', () => {
    it('should return last 3 status history for container', async () => {
        // PREPARE
        const mockResult = [
          {
            statusHistory: [
                { state: 'operativo', timestamp: new Date(), source: "sensor_x" },
                { state: 'dañado', timestamp: new Date(), source: "sensor_y" },
                { state: 'desconocido', timestamp: new Date(), source: "sensor_z" },
            ],
          },
        ];

        eventModel.aggregate.mockResolvedValue(mockResult);

        // EXECUTE
        const result = await repository.findLastThreeStatusById('abc123');

        // VALIDATE
        expect(eventModel.aggregate).toHaveBeenCalled();
        expect(result.length).toBe(3);
        expect(result[0].state).toBe('operativo');
    });

    it('should return empty array if no data found', async () => {
        // PREPARE
        eventModel.aggregate.mockResolvedValue([]);

        // EXECUTE
        const result = await repository.findLastThreeStatusById('containerId');

        // VALIDATE
        expect(result).toEqual([]);
    });
  });
});