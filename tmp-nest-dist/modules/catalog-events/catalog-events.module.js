"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CatalogEventsModule = void 0;
const common_1 = require("@nestjs/common");
const catalog_events_controller_1 = require("./catalog-events.controller");
const catalog_events_service_1 = require("./catalog-events.service");
const catalog_events_repository_1 = require("./catalog-events.repository");
let CatalogEventsModule = class CatalogEventsModule {
};
exports.CatalogEventsModule = CatalogEventsModule;
exports.CatalogEventsModule = CatalogEventsModule = __decorate([
    (0, common_1.Module)({
        controllers: [catalog_events_controller_1.CatalogEventsController],
        providers: [catalog_events_service_1.CatalogEventsService, catalog_events_repository_1.CatalogEventsRepository],
        exports: [catalog_events_service_1.CatalogEventsService],
    })
], CatalogEventsModule);
//# sourceMappingURL=catalog-events.module.js.map