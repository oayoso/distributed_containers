import { Test, TestingModule } from '@nestjs/testing';
import { EventsService } from './events.service';
import { IEventsRepository } from '../interfaces/events.repository.interface';
import { EventsRepository } from '../repositories/events.repository';
import { RabbitMQProducerService } from '../../rabbitmq/service/rabbitmq-producer.service';
import { IRabbitMQProducerService } from '../../rabbitmq/interfaces/rabbitmq-producer.service.interface';

describe('EventsService', () => {
  let service: EventsService;
  let repository: EventsRepository;

  let repositoryMock: jest.Mocked<IEventsRepository>;
  let rabbitMQProducerServiceMock: jest.Mocked<IRabbitMQProducerService>;

  beforeEach(async () => {
    repositoryMock = {
      create: jest.fn(),
      findLastThreeStatusById: jest.fn(),
    };

    rabbitMQProducerServiceMock = {
      emit: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EventsService,
        {
          provide: 'IEventsRepository',
          useValue: repositoryMock,
        },
        {
          provide: 'IRabbitMQProducerService',
          useValue: rabbitMQProducerServiceMock
        },
      ],
    }).compile();

    service = module.get<EventsService>(EventsService);
    repository = module.get<EventsRepository>('IEventsRepository');
  });

  it('should call [EventsService]-[findLastThreeStatusById] and return a success last three events filter by id', async () => {
    // PREPARE
    const repositoryFindLast = jest.spyOn(repository, 'findLastThreeStatusById')
      .mockResolvedValue([{ containerId: 1, state: 'active', timestamp: "2025-04-23T00:12:45.625Z", source: 'system', }]);
    
    // EXECUTE
    const response = await service.findLastThreeStatusById("containerId");

    // VALIDATE
    expect(response).toEqual([{ containerId: 1, state: 'active', timestamp: "2025-04-23T00:12:45.625Z", source: 'system', }]);
    expect(repositoryFindLast).toHaveBeenCalledWith("containerId")
  });
});
