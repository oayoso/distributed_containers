import { Inject, Injectable } from "@nestjs/common";
import { IRabbitMQService } from "../interfaces/rabbitmq.service.interface";
import { ProcessEventDto } from "../dtos/create-event.dto";
import { IEventsService } from "../../events/interfaces/events.service.interface";
import { CriterioEstado } from "../interfaces/criterio-estado.interface";
import { QuorumCriterio } from "../validation/quorum-criterio.validation";
import { SensorPriority } from "../validation/sensor-priority.validation";
import { IContainerService } from "../../container/interfaces/events.service.interface";


@Injectable()
export class RabbitMQService implements IRabbitMQService {
    private criterios: CriterioEstado [];

    constructor (
        @Inject('IEventsService')
        private readonly eventsService: IEventsService,
        @Inject('IContainerService')
        private readonly containerService: IContainerService,
    ) {} 

    async process(payload: ProcessEventDto): Promise<void> {
        let state = false;
        const findListById = await this.eventsService.findLastThreeStatusById(payload.containerId) || [];

        const constructor = { listEvent: findListById, lastStateEventById: payload.state }

        this.criterios = [
            new QuorumCriterio(constructor), 
            new SensorPriority(constructor)
        ]

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
}