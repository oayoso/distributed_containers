import { IContainerService } from '../interfaces/events.service.interface';
import { IContainerRepository } from '../interfaces/events.repository.interface';
import { ParamDto } from '../dto/param.dto';
export declare class ContainerService implements IContainerService {
    private readonly containerRepository;
    constructor(containerRepository: IContainerRepository);
    create(container: any): Promise<void>;
    findById(param: ParamDto): Promise<any>;
    getPaginatedContainers(page: number, limit: number): Promise<any>;
}
