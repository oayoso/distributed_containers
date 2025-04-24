import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { IContainerRepository } from '../interfaces/events.repository.interface';
import { Types } from 'mongoose';


export type ContainerDocument = {
  containerId: string;
  timestamp: Date;
  state: string;
};

@Injectable()
export class ContainerRepository implements IContainerRepository {
  constructor(
    @InjectModel('Container') private readonly containerModel: Model<ContainerDocument>
  ) {}

  async create(container: ContainerDocument): Promise<void> {
    const existing = await this.containerModel.findOne({ containerId: container.containerId });

    if (existing) {
      existing.state = container.state;
      existing.timestamp = new Date(),
      await existing.save();
    } else {
      await this.containerModel.create({
        containerId: container.containerId,
        timestamp: new Date(),
        state: container.state
      });
    }
  }

  async findById(id: string): Promise<any> {
    return this.containerModel.findOne({ _id: new Types.ObjectId(id) });
  }

  async listFilterSkipAndLimit(skip: number, limit: number): Promise<any> {
    return this.containerModel
      .find({ state: { $ne: "desconocido" } })
      .sort({ timestamp: -1 })
      .skip(skip)
      .limit(limit)
      .exec();
  }

  async countDocuments(): Promise<any> {
    return this.containerModel.countDocuments().exec();
  }
}