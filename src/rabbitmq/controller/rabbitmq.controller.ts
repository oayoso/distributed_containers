import { Controller, Inject } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { IRabbitMQService } from '../interfaces/rabbitmq.service.interface';
import { ProcessEventDto } from '../dtos/create-event.dto';


@Controller()
export class RabbitMQController {
  constructor(
    @Inject('IRabbitMQService')
    private readonly rabbitMQService: IRabbitMQService,
  ) {}

  @EventPattern('process-event')
  async process(@Payload() payload: ProcessEventDto) {
    await this.rabbitMQService.process(payload);
    return { message: "se guardo correctamente" }
  }
}