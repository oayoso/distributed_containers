import { Inject, Injectable } from '@nestjs/common';
import { IContainerService } from '../interfaces/events.service.interface';
import { IContainerRepository } from '../interfaces/events.repository.interface';
import { ParamDto } from '../dto/param.dto';


@Injectable()
export class ContainerService implements IContainerService {
    constructor(
        @Inject('IContainerRepository')
        private readonly containerRepository: IContainerRepository,
    ) {}

    async create(container: any): Promise<void> {
        await this.containerRepository.create(container);
    }

    async findById(param: ParamDto): Promise<any> {
        let response = {};
        const container = await this.containerRepository.findById(param.id);

        if (container) {
            response = {
                state: container?.state
            }
        }

        return response;
    }

    async getPaginatedContainers(page: number, limit: number): Promise<any> {
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.containerRepository.listFilterSkipAndLimit(skip, limit),
            this.containerRepository.countDocuments(),
        ]);
        
        const lastPage = Math.ceil(total / limit);
        const hasNextPage = page < lastPage;
        const hasPrevPage = page > 1;

        return {
            total,
            page,
            limit,
            lastPage,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
            data,
        };
    }
}
