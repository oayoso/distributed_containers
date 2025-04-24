// container.repository.spec.ts
import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { ContainerRepository, ContainerDocument } from './container.repository';


describe('ContainerRepository', () => {
  let repository: ContainerRepository;
  let containerModel: any;

  const mockContainer: ContainerDocument = {
    containerId: 'ABC123',
    timestamp: new Date(),
    state: 'operational',
  };

  const mockExistingContainer = {
    containerId: 'ABC123',
    timestamp: new Date(),
    state: 'operational',
    save: jest.fn().mockResolvedValue(true),
  };

  const mockContainerId = new Types.ObjectId().toString();
  const mockContainerWithId = {
    _id: mockContainerId,
    ...mockContainer,
  };

  beforeEach(async () => {
    containerModel = {
      findOne: jest.fn(),
      create: jest.fn(),
      find: jest.fn(() => ({
        sort: jest.fn(() => ({
          skip: jest.fn(() => ({
            limit: jest.fn(() => ({
              exec: jest.fn().mockResolvedValue([mockContainerWithId]),
            })),
          })),
        })),
      })),
      countDocuments: jest.fn(() => ({
        exec: jest.fn().mockResolvedValue(1),
      })),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContainerRepository,
        {
          provide: getModelToken('Container'),
          useValue: containerModel,
        },
      ],
    }).compile();

    repository = module.get<ContainerRepository>(ContainerRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('should update existing container if it exists', async () => {
      // PREPARE
      containerModel.findOne!.mockResolvedValueOnce(mockExistingContainer);
      
      // EXECUTE
      await repository.create({
        containerId: 'ABC123',
        timestamp: new Date(),
        state: 'malogrado',
      });
      
      // VALIDATE
      expect(containerModel.findOne).toHaveBeenCalledWith({ containerId: 'ABC123' });
      expect(containerModel.create).not.toHaveBeenCalled();
    });

    it('should create new container if it does not exist', async () => {
      // PREPARE
      containerModel.findOne!.mockResolvedValueOnce(null);
      containerModel.create!.mockResolvedValueOnce(mockContainer);
      
      // EXECUTE
      await repository.create({
        containerId: 'ABC123',
        timestamp: "2025-04-23T00:12:45.625Z",
        state: 'malogrado',
      } as any);
      
      // VALIDATE
      expect(containerModel.findOne).toHaveBeenCalledWith({ containerId: 'ABC123' });
      expect(containerModel.create).toHaveBeenCalled();
    });
  });

  describe('findById', () => {
    it('should find a container by id', async () => {
      // PREPARE
      containerModel.findOne!.mockResolvedValueOnce({
        "_id": "680954bdd6da14b68c4ace47",
        "containerId": "container-123",
        "state": "running",
        "timestamp": "2025-04-23T20:59:41.195Z",
      });
      
      // EXECUTE
      const result = await repository.findById("68094a8515c7817ec15effc7");
      
      // VALIDATE
      expect(containerModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId("68094a8515c7817ec15effc7") });
      expect(result).toEqual({
          "_id": "680954bdd6da14b68c4ace47",
          "containerId": "container-123",
          "state": "running",
          "timestamp": "2025-04-23T20:59:41.195Z",
        });
    });

    it('should return null if container not found', async () => {
      // PREPARE
      containerModel.findOne!.mockResolvedValueOnce(null);
      
      // EXECUTE
      const result = await repository.findById(mockContainerId);
      
      // VALIDATE
      expect(containerModel.findOne).toHaveBeenCalledWith({ _id: new Types.ObjectId(mockContainerId) });
      expect(result).toBeNull();
    });
  });

  describe('listFilterSkipAndLimit', () => {
    it('should return containers with pagination', async () => {
      // PREPARE
      const skip = 0;
      const limit = 10;
      
      // EXECUTE
      const result = await repository.listFilterSkipAndLimit(skip, limit);
      
      // VALIDATE
      expect(result).toEqual([mockContainerWithId]);
    });
  });

  describe('countDocuments', () => {
    it('should return the count of all containers', async () => {
      // EXECUTE
      const result = await repository.countDocuments();
      
      // VALIDATE
      expect(result).toBe(1);
    });
  });
});