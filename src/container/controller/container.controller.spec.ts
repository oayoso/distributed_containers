import { Test, TestingModule } from '@nestjs/testing';
import { ContainerController } from './container.controller';
import { ContainerService } from '../service/container.service';
import { IContainerRepository } from '../interfaces/events.repository.interface';
import { ContainerRepository } from '../repositories/container.repository';


describe('ContainerController', () => {
  let controller: ContainerController;
  let service: ContainerService;
  let repository: ContainerRepository;

  let containerRepositoryMock: jest.Mocked<IContainerRepository>;

  beforeEach(async () => {
    containerRepositoryMock = {
      countDocuments: jest.fn(),
      create: jest.fn(),
      findById: jest.fn(),
      listFilterSkipAndLimit: jest.fn(),
    }

    const module: TestingModule = await Test.createTestingModule({
      controllers: [
        ContainerController
      ],
      providers: [
        {
          provide: "IContainerService",
          useClass: ContainerService
        },
        {
          provide: "IContainerRepository",
          useValue: containerRepositoryMock
        },
      ]
    }).compile();

    controller = module.get<ContainerController>(ContainerController);
    service = module.get<ContainerService>('IContainerService');
    repository = module.get<ContainerRepository>('IContainerRepository');
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('GET /container/:id/status', () => {
    it('should return container data by id', async () => {
      // PREPARE
      const param = { id: '6807f9a02f668551f6b20cbe' };

      const serviceFindById = jest.spyOn(service, 'findById');
      const repositoryFinBy = jest.spyOn(repository, 'findById')
        .mockResolvedValueOnce({
          "containerId": "ABC123",
          "state": "operational",
          "timestamp": "2025-04-23T10:00:00Z",
          "source": "sensor_main",
          "_id": "6807f9a02f668551f6b20cbe"
        });
      
      // EXECUTE
      const result = await controller.create(param);

      // VALIDATE
      expect(result).toStrictEqual({"state": "operational"});
      expect(serviceFindById).toHaveBeenCalledWith({"id": "6807f9a02f668551f6b20cbe"});
      expect(repositoryFinBy).toHaveBeenCalledWith("6807f9a02f668551f6b20cbe");
    });
  });

  describe('GET /container?page=1&limit=10', () => {
    it('should return paginated container data', async () => {
      // PREPARE
      const serviceGetPagination = jest.spyOn(service, 'getPaginatedContainers')
        .mockResolvedValueOnce({
          "total": 1,
          "page": "1",
          "limit": "10",
          "lastPage": 1,
          "hasNextPage": false,
          "hasPrevPage": false,
          "nextPage": null,
          "prevPage": null,
          "data": [
            {
              "containerId": "ABC123",
              "state": "operational",
              "timestamp": "2025-04-23T10:00:00Z",
              "_id": "6807f9a02f668551f6b20cbe",
              "__v": 0
            }
          ]
        });

      jest.spyOn(repository, 'listFilterSkipAndLimit')
        .mockResolvedValueOnce([
          {
            "containerId": "ABC123",
            "state": "operational",
            "timestamp": "2025-04-23T10:00:00Z",
            "_id": "6807f9a02f668551f6b20cbe",
            "__v": 0
          }
        ]);

      jest.spyOn(repository, 'countDocuments')
        .mockResolvedValueOnce(1);


      // EXECUTE
      const result = await controller.listPagination(1, 10);

      // VALIDATE
      expect(result).toStrictEqual({
        "data": [
          {
            "__v": 0, "_id": "6807f9a02f668551f6b20cbe", 
            "containerId": "ABC123", "state": "operational", 
            "timestamp": "2025-04-23T10:00:00Z"
          }
        ], 
        "hasNextPage": false, 
        "hasPrevPage": false, 
        "lastPage": 1, 
        "limit": "10", 
        "nextPage": null, 
        "page": "1", 
        "prevPage": null, 
        "total": 1
      });

      expect(serviceGetPagination).toHaveBeenCalledWith(1, 10)
    });
  });
});
