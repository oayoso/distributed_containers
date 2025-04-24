"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerRepository = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const mongoose_3 = require("mongoose");
let ContainerRepository = class ContainerRepository {
    containerModel;
    constructor(containerModel) {
        this.containerModel = containerModel;
    }
    async create(container) {
        const existing = await this.containerModel.findOne({ containerId: container.containerId });
        if (existing) {
            existing.state = container.state;
            existing.timestamp = new Date(),
                await existing.save();
        }
        else {
            await this.containerModel.create({
                containerId: container.containerId,
                timestamp: new Date(),
                state: container.state
            });
        }
    }
    async findById(id) {
        return this.containerModel.findOne({ _id: new mongoose_3.Types.ObjectId(id) });
    }
    async listFilterSkipAndLimit(skip, limit) {
        return this.containerModel
            .find({ state: { $ne: "desconocido" } })
            .sort({ timestamp: -1 })
            .skip(skip)
            .limit(limit)
            .exec();
    }
    async countDocuments() {
        return this.containerModel.countDocuments().exec();
    }
};
exports.ContainerRepository = ContainerRepository;
exports.ContainerRepository = ContainerRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)('Container')),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ContainerRepository);
//# sourceMappingURL=container.repository.js.map