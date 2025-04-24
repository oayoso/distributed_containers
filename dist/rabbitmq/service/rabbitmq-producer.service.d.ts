import { ClientRMQ } from '@nestjs/microservices';
import { IRabbitMQProducerService } from '../interfaces/rabbitmq-producer.service.interface';
export declare class RabbitMQProducerService implements IRabbitMQProducerService {
    private readonly client;
    constructor(client: ClientRMQ);
    onModuleInit(): Promise<void>;
    emit(pattern: string, data: any): Promise<void>;
}
