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
exports.ContainerService = void 0;
const common_1 = require("@nestjs/common");
let ContainerService = class ContainerService {
    containerRepository;
    constructor(containerRepository) {
        this.containerRepository = containerRepository;
    }
    async create(container) {
        await this.containerRepository.create(container);
    }
    async findById(param) {
        let response = {};
        const container = await this.containerRepository.findById(param.id);
        if (container) {
            response = {
                state: container?.state
            };
        }
        return response;
    }
    async getPaginatedContainers(page, limit) {
        const skip = (page - 1) * limit;
        const [data, total] = await Promise.all([
            this.containerRepository.listFilterSkipAndLimit(skip, limit),
            this.containerRepository.countDocuments(),
        ]);
        const lastPage = Math.ceil(total / limit);
        const hasNextPage = page < lastPage;
        const hasPrevPage = page > 1;
        return {
            total,
            page,
            limit,
            lastPage,
            hasNextPage,
            hasPrevPage,
            nextPage: hasNextPage ? page + 1 : null,
            prevPage: hasPrevPage ? page - 1 : null,
            data,
        };
    }
};
exports.ContainerService = ContainerService;
exports.ContainerService = ContainerService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)('IContainerRepository')),
    __metadata("design:paramtypes", [Object])
], ContainerService);
//# sourceMappingURL=container.service.js.map