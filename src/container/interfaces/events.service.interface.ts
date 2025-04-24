import { ParamDto } from "../dto/param.dto";

export interface IContainerService {
  create(event: any): Promise<void>;
  findById(param: ParamDto): Promise<any>;
  getPaginatedContainers(page: number, limit: number): Promise<any>;
}