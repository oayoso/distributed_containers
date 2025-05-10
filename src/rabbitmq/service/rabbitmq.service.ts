import { Inject, Injectable } from "@nestjs/common";
import { IRabbitMQService } from "../interfaces/rabbitmq.service.interface";
import { ProcessEventDto } from "../dtos/create-event.dto";
import { IEventsService } from "../../events/interfaces/events.service.interface";
import { QuorumCriterio } from "../validation/quorum-criterio.validation";
import { SensorPriority } from "../validation/sensor-priority.validation";
import { IContainerService } from "../../container/interfaces/events.service.interface";


@Injectable()
export class RabbitMQService implements IRabbitMQService {

    constructor (
        @Inject('IEventsService')
        private readonly eventsService: IEventsService,
        @Inject('IContainerService')
        private readonly containerService: IContainerService,
    ) {} 

    async process(payload: ProcessEventDto): Promise<void> {
        let validation = false;
        const findListById = await this.eventsService.findLastThreeStatusById(payload.containerId) || [];

        const constructor = { listEvent: findListById, lastStateEventById: payload.state }

        const validationCase = {
            quorum: new QuorumCriterio(constructor),
            sensor: new SensorPriority(constructor),
        }

        const [quorun, sensor] = await Promise.all([
            validationCase.quorum.evaluar(),
            validationCase.sensor.evaluar(),
        ])

        validation = sensor || quorun;

        if (validation) {
            const request = { containerId: payload.containerId, state: payload.state };
            await this.containerService.create(request);
        }
    }
}