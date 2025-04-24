import { Model } from 'mongoose';
import { IEventsRepository } from '../interfaces/events.repository.interface';
import { CreateEventDto } from '../dtos/create-event.dto';
export type EventDocument = {
    containerId: string;
    statusHistory: {
        state: string;
        timestamp: Date;
        source: string;
    }[];
};
export declare class EventsRepository implements IEventsRepository {
    private readonly eventModel;
    constructor(eventModel: Model<EventDocument>);
    create(event: CreateEventDto): Promise<void>;
    findLastThreeStatusById(containerId: string): Promise<any>;
}
