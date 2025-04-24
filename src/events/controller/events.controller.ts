import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateEventDto } from '../dtos/create-event.dto';
import { IEventsService } from '../interfaces/events.service.interface';


@Controller('events')
export class EventsController { 
    constructor(
        @Inject('IEventsService')
        private readonly eventsService: IEventsService,
    ) {}

    @Post()
    async create(
        @Body() request: CreateEventDto
    ) {
        await this.eventsService.create(request);
        return { message: "se guardo correctamente" }
    }
}
