import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsModule } from './events/module/events.module';
import { RabbitMQModule } from './rabbitmq/module/rabbitmq.module';
import { ContainerModule } from './container/module/container.module';
import { ConfigService } from '@nestjs/config';
require('dotenv').config();


@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(process.env.MONGODB_URI!),
    // MongooseModule.forRootAsync({
    //   useFactory: async (configService: ConfigService) => ({
    //     uri: configService.get<string>('MONGODB_URI'), // Obtener la URI de MongoDB desde .env
    //   }),
    //   inject: [ConfigService],
    // }),
    // MongooseModule.forRoot("mongodb://admin:secret123@mongodb:27017/admin"),
    RabbitMQModule, 
    EventsModule,
    ContainerModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
