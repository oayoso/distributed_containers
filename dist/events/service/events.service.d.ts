import { IEventsService } from '../interfaces/events.service.interface';
import { CreateEventDto } from '../dtos/create-event.dto';
import { IEventsRepository } from '../interfaces/events.repository.interface';
import { IRabbitMQProducerService } from '../../rabbitmq/interfaces/rabbitmq-producer.service.interface';
export declare class EventsService implements IEventsService {
    private readonly eventsRepository;
    private readonly rabbitMQProducerService;
    constructor(eventsRepository: IEventsRepository, rabbitMQProducerService: IRabbitMQProducerService);
    create(event: CreateEventDto): Promise<void>;
    findLastThreeStatusById(containerId: string): Promise<any>;
}
