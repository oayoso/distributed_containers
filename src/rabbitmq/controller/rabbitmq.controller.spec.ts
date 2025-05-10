import { Test, TestingModule } from '@nestjs/testing';
import { RabbitMQController } from '../controller/rabbitmq.controller';
import { RabbitMQService } from '../service/rabbitmq.service';
import { IEventsService } from '../../events/interfaces/events.service.interface';
import { IContainerService } from '../../container/interfaces/events.service.interface';
import { ProcessEventDto } from '../dtos/create-event.dto';
import { EventsService } from '../../events/service/events.service';
import { ContainerService } from '../../container/service/container.service';
import { QuorumCriterio } from '../validation/quorum-criterio.validation';
import { SensorPriority } from '../validation/sensor-priority.validation';


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

    jest.clearAllMocks();
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

  it('should call [RabbitMQController]-[process] when exist events by containerId and only validation quorum is true', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_y',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
          { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_g" },
          { state: 'operativo', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_h" },
          { state: 'operativo', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_o" },
        ]);

    const quorumSpy = jest.spyOn(QuorumCriterio.prototype, 'evaluar');
    const sensorSpy = jest.spyOn(SensorPriority.prototype, 'evaluar');

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).toHaveBeenCalledWith({"containerId": "abc123", "state": "operativo"});

    expect(quorumSpy.mock.results[0].value).toBe(true);
    expect(sensorSpy.mock.results[0].value).toBe(false);
  });

  it('should call [RabbitMQController]-[process] when exist events by containerId and only validation sensor is true', async () => {
    // PREPARE
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_y',
    };

    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
          { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_main" },
          { state: 'malogrado', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_y" },
          { state: 'descompuesto', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_z" },
        ]);
    
    const quorumSpy = jest.spyOn(QuorumCriterio.prototype, 'evaluar');
    const sensorSpy = jest.spyOn(SensorPriority.prototype, 'evaluar');

    const containerServiceCreate = jest.spyOn(containerService, 'create');

    // EXECUTE
    const result = await controller.process(payload);

    // VALIDATE
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    // expect(containerServiceCreate).not.toHaveBeenCalled();
    expect(containerServiceCreate).toHaveBeenCalledWith({"containerId": "abc123", "state": "operativo"});
    expect(quorumSpy.mock.results[0].value).toBe(false);
    expect(sensorSpy.mock.results[0].value).toBe(true);
  });

  it('should call [RabbitMQController]-[process] when exist events by containerId but none of the validations is true ', async () => {
    const payload: ProcessEventDto = {
      containerId: 'abc123',
      state: 'operativo',
      timestamp: "2025-04-23T00:12:45.625Z",
      source: 'sensor_x',
    };
  
    const eventServiceFindList = jest.spyOn(eventService, 'findLastThreeStatusById')
      .mockResolvedValueOnce([
        { state: 'operativo', timestamp: "2025-04-23T00:13:45.625Z", source: "sensor_a" },
        { state: 'mantenimiento', timestamp: "2025-04-23T00:12:45.625Z", source: "sensor_b" },
        { state: 'operativo', timestamp: "2025-04-23T00:11:45.625Z", source: "sensor_c" },
      ]);

    const quorumSpy = jest.spyOn(QuorumCriterio.prototype, 'evaluar');
    const sensorSpy = jest.spyOn(SensorPriority.prototype, 'evaluar');
  
    const containerServiceCreate = jest.spyOn(containerService, 'create');
  
    const result = await controller.process(payload);
  
    expect(result).toEqual({ message: 'se guardo correctamente' });
    expect(eventServiceFindList).toHaveBeenCalledWith("abc123");
    expect(containerServiceCreate).not.toHaveBeenCalled();
    expect(quorumSpy.mock.results[0].value).toBe(false);
    expect(sensorSpy.mock.results[0].value).toBe(false);
  });
});