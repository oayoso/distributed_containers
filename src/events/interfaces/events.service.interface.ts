import { CreateEventDto } from "../dtos/create-event.dto";

export interface IEventsService {
  create(event: CreateEventDto): Promise<void>;
  findLastThreeStatusById(containerId: string): Promise<any>;
}