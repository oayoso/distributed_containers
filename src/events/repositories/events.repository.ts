import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
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

@Injectable()
export class EventsRepository implements IEventsRepository {
  constructor(
    @InjectModel('Event') private readonly eventModel: Model<EventDocument>
  ) {}

  async create(event: CreateEventDto): Promise<void> {
    const existing = await this.eventModel.findOne({ containerId: event.containerId });

    const status = {
      state: event.state,
      timestamp: new Date(event.timestamp),
      source: event.source,
    };

    if (existing) {
      existing.statusHistory.push(status);
      await existing.save();
    } else {
      await this.eventModel.create({
        containerId: event.containerId,
        statusHistory: [status],
      });
    }
  }

  async findLastThreeStatusById(containerId: string): Promise<any> {
    let query: any[] = await this.eventModel.aggregate([
      {
        $match: { containerId }
      },
      {
        $project: {
          statusHistory: {
            $slice: [
              {
                $sortArray: {
                  input: "$statusHistory",
                  sortBy: { timestamp: -1 }
                }
              },
              3
            ]
          },
          _id: 0
        }
      }
    ]) || [];
    
    query = !query.length ? query: query[0]?.statusHistory; 
    return query
  };
}