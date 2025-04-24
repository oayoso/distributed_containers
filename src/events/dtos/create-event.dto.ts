import { IsISO8601, IsString } from 'class-validator';

export class CreateEventDto {
  @IsString()
  containerId: string;

  @IsString()
  state: string;

  @IsISO8601()
  timestamp: string;

  @IsString()
  source: string;
}