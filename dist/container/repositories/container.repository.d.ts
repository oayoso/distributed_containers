import { Model } from 'mongoose';
import { IContainerRepository } from '../interfaces/events.repository.interface';
export type ContainerDocument = {
    containerId: string;
    timestamp: Date;
    state: string;
};
export declare class ContainerRepository implements IContainerRepository {
    private readonly containerModel;
    constructor(containerModel: Model<ContainerDocument>);
    create(container: ContainerDocument): Promise<void>;
    findById(id: string): Promise<any>;
    listFilterSkipAndLimit(skip: number, limit: number): Promise<any>;
    countDocuments(): Promise<any>;
}
