import { CreateEventDto } from '../dtos/create-event.dto';
import { IEventsService } from '../interfaces/events.service.interface';
export declare class EventsController {
    private readonly eventsService;
    constructor(eventsService: IEventsService);
    create(request: CreateEventDto): Promise<{
        message: string;
    }>;
}
