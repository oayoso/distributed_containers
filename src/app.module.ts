import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/module/events.module';
import { RabbitMQModule } from './rabbitmq/module/rabbitmq.module';
import { ContainerModule } from './container/module/container.module';


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot("mongodb://admin:secret123@localhost:27017/"),
    RabbitMQModule, 
    EventsModule,
    ContainerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
