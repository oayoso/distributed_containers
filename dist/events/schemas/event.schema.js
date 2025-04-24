"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EventSchema = void 0;
const mongoose_1 = require("mongoose");
exports.EventSchema = new mongoose_1.Schema({
    containerId: { type: String, required: true, index: true },
    statusHistory: [
        {
            state: { type: String },
            timestamp: { type: Date },
            source: { type: String },
        },
    ],
});
exports.EventSchema.index({ 'statusHistory.timestamp': -1 });
//# sourceMappingURL=event.schema.js.map