"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.QuorumCriterio = void 0;
class QuorumCriterio {
    QUORUM_MINIMO = 3;
    listEvent;
    lastStateEventById;
    constructor({ listEvent, lastStateEventById }) {
        this.listEvent = listEvent;
        this.lastStateEventById = lastStateEventById;
    }
    evaluar() {
        let response = false;
        if (!this.listEvent.length)
            return response;
        const countByState = {};
        for (const evento of this.listEvent) {
            countByState[evento?.state] = (countByState[evento?.state] || 0) + 1;
        }
        if (countByState[this.lastStateEventById] && countByState[this.lastStateEventById] >= this.QUORUM_MINIMO) {
            response = true;
        }
        return response;
    }
}
exports.QuorumCriterio = QuorumCriterio;
//# sourceMappingURL=quorum-criterio.validation.js.map