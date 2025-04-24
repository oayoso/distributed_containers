import { Inject, Injectable } from '@nestjs/common';
import { ClientRMQ } from '@nestjs/microservices';
import { IRabbitMQProducerService } from '../interfaces/rabbitmq-producer.service.interface';

@Injectable()
export class RabbitMQProducerService implements IRabbitMQProducerService {
    constructor(
        @Inject('RABBITMQ_SERVICE')
        private readonly client: ClientRMQ
    ) {}

    async onModuleInit() { 
        await this.client.connect();
    }

    async emit(pattern: string, data: any) {
        this.client.send(pattern, data).subscribe();
    }
}
