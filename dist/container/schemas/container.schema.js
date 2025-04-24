"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerSchema = void 0;
const mongoose_1 = require("mongoose");
exports.ContainerSchema = new mongoose_1.Schema({
    containerId: { type: String, required: true },
    timestamp: { type: Date, required: true, index: true },
    state: { type: String, required: true },
});
//# sourceMappingURL=container.schema.js.map