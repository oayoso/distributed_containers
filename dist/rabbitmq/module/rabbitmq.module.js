"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQModule = void 0;
const common_1 = require("@nestjs/common");
const rabbitmq_producer_service_1 = require("../service/rabbitmq-producer.service");
const microservices_1 = require("@nestjs/microservices");
const rabbitmq_controller_1 = require("../controller/rabbitmq.controller");
const rabbitmq_service_1 = require("../service/rabbitmq.service");
const events_module_1 = require("../../events/module/events.module");
const container_module_1 = require("../../container/module/container.module");
let RabbitMQModule = class RabbitMQModule {
};
exports.RabbitMQModule = RabbitMQModule;
exports.RabbitMQModule = RabbitMQModule = __decorate([
    (0, common_1.Module)({
        controllers: [
            rabbitmq_controller_1.RabbitMQController,
        ],
        imports: [
            microservices_1.ClientsModule.register([
                {
                    name: 'RABBITMQ_SERVICE',
                    transport: microservices_1.Transport.RMQ,
                    options: {
                        urls: ['amqp://guest:guest@localhost:5672'],
                        queue: 'nestjs_queue',
                        queueOptions: { durable: false },
                    },
                },
            ]),
            (0, common_1.forwardRef)(() => events_module_1.EventsModule),
            container_module_1.ContainerModule
        ],
        providers: [
            {
                provide: "IRabbitMQProducerService",
                useClass: rabbitmq_producer_service_1.RabbitMQProducerService
            },
            {
                provide: "IRabbitMQService",
                useClass: rabbitmq_service_1.RabbitMQService
            },
        ],
        exports: [
            {
                provide: "IRabbitMQProducerService",
                useClass: rabbitmq_producer_service_1.RabbitMQProducerService
            },
        ]
    })
], RabbitMQModule);
//# sourceMappingURL=rabbitmq.module.js.map