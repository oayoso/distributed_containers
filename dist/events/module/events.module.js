"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventsModule = void 0;
const common_1 = require("@nestjs/common");
const events_service_1 = require("../service/events.service");
const mongoose_1 = require("@nestjs/mongoose");
const event_schema_1 = require("../schemas/event.schema");
const events_controller_1 = require("../controller/events.controller");
const events_repository_1 = require("../repositories/events.repository");
const rabbitmq_module_1 = require("../../rabbitmq/module/rabbitmq.module");
let EventsModule = class EventsModule {
};
exports.EventsModule = EventsModule;
exports.EventsModule = EventsModule = __decorate([
    (0, common_1.Module)({
        imports: [
            mongoose_1.MongooseModule.forFeature([{ name: "Event", schema: event_schema_1.EventSchema }]),
            (0, common_1.forwardRef)(() => rabbitmq_module_1.RabbitMQModule)
        ],
        controllers: [
            events_controller_1.EventsController
        ],
        providers: [
            {
                provide: "IEventsService",
                useClass: events_service_1.EventsService
            },
            {
                provide: "IEventsRepository",
                useClass: events_repository_1.EventsRepository
            },
        ],
        exports: [
            {
                provide: "IEventsService",
                useClass: events_service_1.EventsService
            },
        ]
    })
], EventsModule);
//# sourceMappingURL=events.module.js.map