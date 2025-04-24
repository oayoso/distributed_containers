import { Module } from '@nestjs/common';
import { ContainerController } from '../controller/container.controller';
import { ContainerService } from '../service/container.service';
import { EventsModule } from '../../events/module/events.module';
import { MongooseModule } from '@nestjs/mongoose';
import { ContainerSchema } from '../schemas/container.schema';
import { ContainerRepository } from '../repositories/container.repository';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: "Container", schema: ContainerSchema }]),
  ],
  controllers: [
    ContainerController
  ],
  providers: [
    {
      provide: "IContainerService",
      useClass: ContainerService
    },
    {
      provide: "IContainerRepository",
      useClass: ContainerRepository
    },
  ],
  exports: [
    {
      provide: "IContainerService",
      useClass: ContainerService
    },
  ]
})
export class ContainerModule {}
