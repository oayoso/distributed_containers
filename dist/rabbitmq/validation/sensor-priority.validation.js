"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SensorPriority = void 0;
class SensorPriority {
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
        const LIST_PRIORITY_SENSDOR = ['sensor_main', 'sensor_y'];
        const lastEvent = this.listEvent[0];
        if (LIST_PRIORITY_SENSDOR.includes(lastEvent?.source)) {
            response = true;
        }
        return response;
    }
}
exports.SensorPriority = SensorPriority;
//# sourceMappingURL=sensor-priority.validation.js.map