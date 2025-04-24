import { CriterioEstado } from "../interfaces/criterio-estado.interface";


export class SensorPriority implements CriterioEstado {
    private listEvent: any[];
    private lastStateEventById: string;

    constructor ({listEvent, lastStateEventById}) {
        this.listEvent = listEvent;
        this.lastStateEventById = lastStateEventById;
    }

    evaluar() {
        let response = false;
        if (!this.listEvent.length) return response;
        const LIST_PRIORITY_SENSDOR = ['sensor_main', 'sensor_y']

        const lastEvent = this.listEvent[0];

        if (LIST_PRIORITY_SENSDOR.includes(lastEvent?.source)) {
            response = true;
        }

        return response;
    }
}