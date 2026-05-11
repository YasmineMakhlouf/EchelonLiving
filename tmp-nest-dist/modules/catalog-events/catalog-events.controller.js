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
exports.CatalogEventsController = void 0;
const common_1 = require("@nestjs/common");
const catalog_events_service_1 = require("./catalog-events.service");
let CatalogEventsController = class CatalogEventsController {
    constructor(service) {
        this.service = service;
    }
    async stream(res) {
        res.status(200);
        res.setHeader('Content-Type', 'text/event-stream');
        res.setHeader('Cache-Control', 'no-cache');
        res.setHeader('Connection', 'keep-alive');
        res.flushHeaders?.();
        res.write('event: catalog-change\n');
        res.write('data: {"scope":"all"}\n\n');
        const keepAlive = setInterval(() => {
            res.write(': ping\n\n');
        }, 30000);
        res.on('close', () => {
            clearInterval(keepAlive);
            res.end();
        });
    }
};
exports.CatalogEventsController = CatalogEventsController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], CatalogEventsController.prototype, "stream", null);
exports.CatalogEventsController = CatalogEventsController = __decorate([
    (0, common_1.Controller)('events'),
    __metadata("design:paramtypes", [catalog_events_service_1.CatalogEventsService])
], CatalogEventsController);
//# sourceMappingURL=catalog-events.controller.js.map