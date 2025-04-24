import { ParamDto } from '../dto/param.dto';
import { IContainerService } from '../interfaces/events.service.interface';
export declare class ContainerController {
    private readonly containerService;
    constructor(containerService: IContainerService);
    create(param: ParamDto): Promise<any>;
    listPagination(page?: number, limit?: number): Promise<any>;
}
