import { CriterioEstado } from "../interfaces/criterio-estado.interface";


export class QuorumCriterio implements CriterioEstado {
    private readonly QUORUM_MINIMO = 3;
    private listEvent: any[];
    private lastStateEventById: string;

    constructor ({listEvent, lastStateEventById}) {
        this.listEvent = listEvent;
        this.lastStateEventById = lastStateEventById;
    }
  
    evaluar() {
        let response = false;
        
        if (!this.listEvent.length) return response;

        const countByState: Record<string, number> = {};

        for (const evento of this.listEvent) {
            countByState[evento?.state] = (countByState[evento?.state] || 0) + 1;
        }

        if (countByState[this.lastStateEventById] && countByState[this.lastStateEventById] >= this.QUORUM_MINIMO ) {
            response = true
        }
      
        return response;
    }
  }