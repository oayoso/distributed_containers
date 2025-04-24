import { CreateEventDto } from "../dtos/create-event.dto";
export interface IEventsRepository {
    create(event: CreateEventDto): Promise<void>;
    findLastThreeStatusById(containerId: string): Promise<any>;
}
