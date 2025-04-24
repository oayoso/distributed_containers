import { ProcessEventDto } from "../dtos/create-event.dto";
export interface IRabbitMQService {
    process(payload: ProcessEventDto): Promise<void>;
}
