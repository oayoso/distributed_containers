import { IRabbitMQService } from "../interfaces/rabbitmq.service.interface";
import { ProcessEventDto } from "../dtos/create-event.dto";
import { IEventsService } from "../../events/interfaces/events.service.interface";
import { IContainerService } from "../../container/interfaces/events.service.interface";
export declare class RabbitMQService implements IRabbitMQService {
    private readonly eventsService;
    private readonly containerService;
    private criterios;
    constructor(eventsService: IEventsService, containerService: IContainerService);
    process(payload: ProcessEventDto): Promise<void>;
}
