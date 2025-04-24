import { Test, TestingModule } from '@nestjs/testing';
import { EventsController } from './events.controller';
import { EventsService } from '../service/events.service';
import { EventsRepository } from '../repositories/events.repository';
import { CreateEventDto } from '../dtos/create-event.dto';
import { IEventsRepository } from '../interfaces/events.repository.interface';
import { IRabbitMQProducerService } from '../../rabbitmq/interfaces/rabbitmq-producer.service.interface';
import { RabbitMQProducerService } from '../../rabbitmq/service/rabbitmq-producer.service';


describe('EventsController', () => {
  let controller: EventsController;
  let module: TestingModule;

  let service: EventsService;
  let repository: EventsRepository;
  let rabbitMQProducerService: RabbitMQProducerService;

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

    module = await Test.createTestingModule({
      controllers: [EventsController],
      providers: [
        {
          provide: 'IEventsRepository',
          useValue: repositoryMock,
        },
        {
          provide: 'IEventsService',
          useClass: EventsService,
        },
        {
          provide: 'IRabbitMQProducerService',
          useValue: rabbitMQProducerServiceMock
        },
      ],
    }).compile();

    controller = module.get<EventsController>(EventsController);
    service = module.get<EventsService>('IEventsService');
    repository = module.get<EventsRepository>('IEventsRepository');
    rabbitMQProducerService = module.get<RabbitMQProducerService>('IRabbitMQProducerService');
  });

  it('should call [EventsController]-[create] and return a success message', async () => {
    // PREPARE
    const event: CreateEventDto = {
      containerId: '123',
      state: 'active',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'system',
    };

    const serviceCreate = jest.spyOn(service, 'create');
    const repositoryCreate = jest.spyOn(repository, 'create');
    const rabbitMQServiceEmit = jest.spyOn(rabbitMQProducerService, 'emit');

    // EXECUTE
    const response = await controller.create(event);

    // VALIDATE
    expect(response).toEqual({ message: 'se guardo correctamente' });
    expect(serviceCreate).toHaveBeenCalledWith(event)
    expect(repositoryCreate).toHaveBeenCalledWith(event)
    expect(rabbitMQServiceEmit).toHaveBeenCalledWith("process-event", {"containerId": "123", "source": "system", "state": "active", "timestamp": "2025-04-23T00:12:45.625Z"})
  });
});
