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
exports.ContainerController = void 0;
const common_1 = require("@nestjs/common");
const param_dto_1 = require("../dto/param.dto");
let ContainerController = class ContainerController {
    containerService;
    constructor(containerService) {
        this.containerService = containerService;
    }
    async create(param) {
        return this.containerService.findById(param);
    }
    async listPagination(page = 1, limit = 10) {
        return this.containerService.getPaginatedContainers(page, limit);
    }
};
exports.ContainerController = ContainerController;
__decorate([
    (0, common_1.Get)(':id/status'),
    __param(0, (0, common_1.Param)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [param_dto_1.ParamDto]),
    __metadata("design:returntype", Promise)
], ContainerController.prototype, "create", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('page')),
    __param(1, (0, common_1.Query)('limit')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", Promise)
], ContainerController.prototype, "listPagination", null);
exports.ContainerController = ContainerController = __decorate([
    (0, common_1.Controller)('container'),
    __param(0, (0, common_1.Inject)('IContainerService')),
    __metadata("design:paramtypes", [Object])
], ContainerController);
//# sourceMappingURL=container.controller.js.map