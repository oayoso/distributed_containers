import { Controller, Get, Inject, Param, Query, UseGuards } from '@nestjs/common';
import { ParamDto } from '../dto/param.dto';
import { IContainerService } from '../interfaces/events.service.interface';
import { HeaderAuthGuard } from '../../common/guards/header-auth.guard';

@UseGuards(HeaderAuthGuard) 
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
