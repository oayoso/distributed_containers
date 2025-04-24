import { forwardRef, Module } from '@nestjs/common';
import { RabbitMQProducerService } from '../service/rabbitmq-producer.service';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RabbitMQController } from '../controller/rabbitmq.controller';
import { RabbitMQService } from '../service/rabbitmq.service';
import { EventsModule } from '../../events/module/events.module';
import { ContainerModule } from '../../container/module/container.module';


@Module({
  controllers: [
    RabbitMQController,
  ],
  imports: [
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://guest:guest@localhost:5672'],
          queue: 'nestjs_queue',
          queueOptions: { durable: false },
        },
      },
    ]),
    forwardRef(() => EventsModule),
    ContainerModule
  ],
  providers: [
    {
      provide: "IRabbitMQProducerService",
      useClass: RabbitMQProducerService
    },
    {
      provide: "IRabbitMQService",
      useClass: RabbitMQService
    },
  ],
  exports: [
    {
      provide: "IRabbitMQProducerService",
      useClass: RabbitMQProducerService
    },
  ]
})
export class RabbitMQModule {}
