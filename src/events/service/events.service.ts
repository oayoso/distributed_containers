import { Inject, Injectable } from '@nestjs/common';
import { IEventsService } from '../interfaces/events.service.interface';
import { CreateEventDto } from '../dtos/create-event.dto';
import { IEventsRepository } from '../interfaces/events.repository.interface';
import { IRabbitMQProducerService } from '../../rabbitmq/interfaces/rabbitmq-producer.service.interface';


@Injectable()
export class EventsService implements IEventsService {
    constructor(
        @Inject('IEventsRepository')
        private readonly eventsRepository: IEventsRepository,
        @Inject('IRabbitMQProducerService')
        private readonly rabbitMQProducerService: IRabbitMQProducerService,
    ) {}

    async create(event: CreateEventDto): Promise<void> {
        await this.eventsRepository.create(event);
        await this.rabbitMQProducerService.emit("process-event",event);
    }

    async findLastThreeStatusById(containerId: string): Promise<any> {
        return this.eventsRepository.findLastThreeStatusById(containerId);
    }
}
