import { IsNumber, IsString } from 'class-validator';

export class ParamDto {
  @IsString()
  id: string;
}
