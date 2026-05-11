"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DesignRequestModule = void 0;
const common_1 = require("@nestjs/common");
const design_request_controller_1 = require("./design-request.controller");
const design_request_service_1 = require("./design-request.service");
const design_request_repository_1 = require("./design-request.repository");
let DesignRequestModule = class DesignRequestModule {
};
exports.DesignRequestModule = DesignRequestModule;
exports.DesignRequestModule = DesignRequestModule = __decorate([
    (0, common_1.Module)({
        controllers: [design_request_controller_1.DesignRequestController],
        providers: [design_request_service_1.DesignRequestService, design_request_repository_1.DesignRequestRepository],
        exports: [design_request_service_1.DesignRequestService],
    })
], DesignRequestModule);
//# sourceMappingURL=design-request.module.js.map