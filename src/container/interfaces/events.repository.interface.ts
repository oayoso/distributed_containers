export interface IContainerRepository {
  create(event: any): Promise<void>;
  findById(id: string): Promise<any>;
  listFilterSkipAndLimit(skip: number, limit: number): Promise<any>;
  countDocuments(): Promise<any>;
}