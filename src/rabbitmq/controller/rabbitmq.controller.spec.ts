// jest.mock('../validation/quorum-criterio.validation');
import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQController } from '../controller/rabbitmq.controller';
import { RabbitMQService } from '../service/rabbitmq.service';
import { IEventsService } from '../../events/interfaces/events.service.interface';
import { IContainerService } from '../../container/interfaces/events.service.interface';
import { ProcessEventDto } from '../dtos/create-event.dto';
import { EventsService } from '../../events/service/events.service';
import { ContainerService } from '../../container/service/container.service';
import { QuorumCriterio } from '../validation/quorum-criterio.validation';


describe('RabbitMQController -> RabbitMQService', () => {
  jest.mock('../validation/quorum-criterio.validation');

  let controller: RabbitMQController;
  let eventService: EventsService
  let containerService: ContainerService;

  let eventsServiceMock: jest.Mocked<IEventsService>;
  let containerServiceMock: jest.Mocked<IContainerService>;

  beforeEach(async () => {
    eventsServiceMock = {
      findLastThreeStatusById: jest.fn(),
      create: jest.fn(),
    };

    containerServiceMock = {
      create: jest.fn().mockResolvedValue(undefined),
      findById: jest.fn(),
      getPaginatedContainers: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [RabbitMQController],
      providers: [
        {
          provide: 'IRabbitMQService',
          useClass: RabbitMQService,
        },
        {
          provide: 'IEventsService',
          useValue: eventsServiceMock,
        },
        {
          provide: 'IContainerService',
          useValue: containerServiceMock,
        },
      ],
    }).compile();

    controller = module.get<RabbitMQController>(RabbitMQController);
    eventService = module.get<EventsService>('IEventsService');
    containerService = module.get<ContainerService>('IContainerService');
  });

  it('should call [RabbitMQController]-[process] when not exist events by containerId', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_y',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([])

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).not.toHaveBeenCalled();
  });

  it('should call [RabbitMQController]-[process] when exist events by containerId and quorum is validated', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_y',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
          { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_x" },
          { state: 'operativo', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_y" },
          { state: 'operativo', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_z" },
        ]);

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).toHaveBeenCalledWith({"containerId": "abc123", "state": "operativo"});
  });

  it('should call [RabbitMQController]-[process] when exist events by containerId and quorum is not validated', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_y',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
          { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_x" },
          { state: 'malogrado', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_y" },
          { state: 'descompuesto', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_z" },
        ]);

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).not.toHaveBeenCalled();
  });

  it('should not create container when QuorumCriterio returns false', async () => {
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_x',
    };
  
    // Mock de 3 eventos que normalmente podrían parecer válidos
    const events = [
      { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_a" },
      { state: 'operativo', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_b" },
      { state: 'operativo', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_c" },
    ];
  
    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([]);
  
    const containerServiceCreate = jest.spyOn(containerService, 'create');
  
    const result = await controller.process(payload);
  
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).not.toHaveBeenCalled();
  });

  it('should call [RabbitMQController]-[process] when exist events by containerId and sensor priority is validated', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:13:45.625Z",
      source: 'sensor_main',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
          { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_main" },
          { state: 'malogrado', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_y" },
          { state: 'desconocido', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_z" },
        ]);

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).toHaveBeenCalledWith({"containerId": "abc123", "state": "operativo"});
  });
});