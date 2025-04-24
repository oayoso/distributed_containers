"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RabbitMQService = void 0;
const common_1 = require("@nestjs/common");
const quorum_criterio_validation_1 = require("../validation/quorum-criterio.validation");
const sensor_priority_validation_1 = require("../validation/sensor-priority.validation");
let RabbitMQService = class RabbitMQService {
    eventsService;
    containerService;
    criterios;
    constructor(eventsService, containerService) {
        this.eventsService = eventsService;
        this.containerService = containerService;
    }
    async process(payload) {
        let state = false;
        const findListById = await this.eventsService.findLastThreeStatusById(payload.containerId) || [];
        const constructor = { listEvent: findListById, lastStateEventById: payload.state };
        this.criterios = [
            new quorum_criterio_validation_1.QuorumCriterio(constructor),
            new sensor_priority_validation_1.SensorPriority(constructor)
        ];
        for (let index = 0; index < this.criterios.length; index++) {
            state = this.criterios[index]?.evaluar();
            if (state) {
                break;
            }
        }
        if (state) {
            const request = { containerId: payload.containerId, state: payload.state };
            await this.containerService.create(request);
        }
    }
};
exports.RabbitMQService = RabbitMQService;
exports.RabbitMQService = RabbitMQService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IEventsService')),
    __param(1, (0, common_1.Inject)('IContainerService')),
    __metadata("design:paramtypes", [Object, Object])
], RabbitMQService);
//# sourceMappingURL=rabbitmq.service.js.map