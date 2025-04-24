import { CriterioEstado } from "../interfaces/criterio-estado.interface";
export declare class QuorumCriterio implements CriterioEstado {
    private readonly QUORUM_MINIMO;
    private listEvent;
    private lastStateEventById;
    constructor({ listEvent, lastStateEventById }: {
        listEvent: any;
        lastStateEventById: any;
    });
    evaluar(): boolean;
}
