import { forwardRef, Module } from '@nestjs/common';
import { EventsService } from '../service/events.service';
import { MongooseModule } from '@nestjs/mongoose';
import { EventSchema } from '../schemas/event.schema';
import { EventsController } from '../controller/events.controller';
import { EventsRepository } from '../repositories/events.repository';
import { RabbitMQModule } from '../../rabbitmq/module/rabbitmq.module';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Event", schema: EventSchema }]),
    forwardRef(() => RabbitMQModule)
  ],
  controllers: [
    EventsController
  ],
  providers: [
    {
      provide: "IEventsService",
      useClass: EventsService
    },
    {
      provide: "IEventsRepository",
      useClass: EventsRepository
    },
  ],
  exports: [
    {
      provide: "IEventsService",
      useClass: EventsService
    },
  ]
})
export class EventsModule {}
