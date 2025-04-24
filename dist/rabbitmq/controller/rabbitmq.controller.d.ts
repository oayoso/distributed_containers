import { IRabbitMQService } from '../interfaces/rabbitmq.service.interface';
import { ProcessEventDto } from '../dtos/create-event.dto';
export declare class RabbitMQController {
    private readonly rabbitMQService;
    constructor(rabbitMQService: IRabbitMQService);
    process(payload: ProcessEventDto): Promise<{
        message: string;
    }>;
}
