import { Controller, Get, Inject, Param, Query } from '@nestjs/common';
import { ParamDto } from '../dto/param.dto';
import { IContainerService } from '../interfaces/events.service.interface';


@Controller('container')
export class ContainerController {
    constructor(
        @Inject('IContainerService')
        private readonly containerService: IContainerService,
    ) {}

    @Get(':id/status')
    async create(
        @Param() param: ParamDto
    ) {
        return this.containerService.findById(param)
    }

    @Get()
    async listPagination(
        @Query('page') page = 1,
        @Query('limit') limit = 10,
    ) {
        return this.containerService.getPaginatedContainers(page, limit)
    }
}
