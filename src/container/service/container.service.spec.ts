import { Test, TestingModule } from '@nestjs/testing';
import { ContainerService } from './container.service';
import { ContainerRepository } from '../repositories/container.repository';
import { IContainerRepository } from '../interfaces/events.repository.interface';


describe('ContainerService', () => {
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
      providers: [
        ContainerService,
        {
          provide: "IContainerRepository",
          useValue: containerRepositoryMock
        }
      ],
    }).compile();

    service = module.get<ContainerService>(ContainerService);
    repository = module.get<ContainerRepository>("IContainerRepository");
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should call method create to register a container', async () => {
    // PREPARE
    const repositoryCreate = jest.spyOn(repository, 'create')
        .mockResolvedValueOnce();
    
    // EXECUTE
    const result = await service.create({
      "containerId": "ABC123",
      "state": "operational",
      "timestamp": "2025-04-10T13:00:00Z",
    });

    // VALIDATE
    expect(result).toBeUndefined();

    expect(repositoryCreate).toHaveBeenCalledWith({
      "containerId": "ABC123",
      "state": "operational",
      "timestamp": "2025-04-10T13:00:00Z",
    })
  });

  it('should call method findById to find a container by id', async () => {
    // PREPARE
    const repositoryFindId = jest.spyOn(repository, 'findById')
      .mockResolvedValueOnce({
        "containerId": "ABC123",
        "state": "operational",
        "timestamp": "2025-04-10T13:00:00Z",
        "_id": "6807f9a02f668551f6b20cbe"
      });
    
    // EXECUTE
    const result = await service.findById({ id: "6807f9a02f668551f6b20cbe" });

    // VALIDATE
    expect(result).toStrictEqual({"state": "operational"});

    expect(repositoryFindId).toHaveBeenCalledWith("6807f9a02f668551f6b20cbe")
  });

  it('should call method getPaginatedContainers to paginate list of containers', async () => {
    // PREPARE
    const repositoryList = jest.spyOn(repository, 'listFilterSkipAndLimit')
      .mockResolvedValueOnce([
        {
          "containerId": "ABC123",
          "state": "operational",
          "timestamp": "2025-04-23T10:00:00Z",
          "_id": "6807f9a02f668551f6b20cbe",
          "__v": 0
        },
        {
          "containerId": "ABC1234",
          "state": "malogrado",
          "timestamp": "2025-04-23T11:00:00Z",
          "_id": "6807f9a02f668551f6b20100e",
          "__v": 0
        }
      ]);

    const repositoryCount = jest.spyOn(repository, 'countDocuments')
      .mockResolvedValueOnce(2);
    
    // EXECUTE
    const result = await service.getPaginatedContainers(1, 2);

    // VALIDATE
    expect(result).toStrictEqual({
      "total": 2,
      "page": 1,
      "limit": 2,
      "lastPage": 1,
      "hasNextPage": false,
      "hasPrevPage": false,
      "nextPage": null,
      "prevPage": null,
      "data": [
          {
              "_id": "6807f9a02f668551f6b20cbe",
              "containerId": "ABC123",
              "timestamp": "2025-04-23T10:00:00Z",
              "state": "operational",
              "__v": 0
          },
          {
            "_id": "6807f9a02f668551f6b20100e",
            "containerId": "ABC1234",
            "state": "malogrado",
            "timestamp": "2025-04-23T11:00:00Z",
            "__v": 0
          }
      ]
    });

    expect(repositoryList).toHaveBeenCalledWith(0, 2);
    expect(repositoryCount).toHaveBeenCalled();
  });
});
