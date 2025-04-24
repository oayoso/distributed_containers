import { CriterioEstado } from "../interfaces/criterio-estado.interface";
export declare class SensorPriority implements CriterioEstado {
    private listEvent;
    private lastStateEventById;
    constructor({ listEvent, lastStateEventById }: {
        listEvent: any;
        lastStateEventById: any;
    });
    evaluar(): boolean;
}
