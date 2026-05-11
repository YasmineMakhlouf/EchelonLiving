"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageModule = void 0;
const common_1 = require("@nestjs/common");
const product_image_controller_1 = require("./product-image.controller");
const product_image_service_1 = require("./product-image.service");
const product_image_repository_1 = require("./product-image.repository");
let ProductImageModule = class ProductImageModule {
};
exports.ProductImageModule = ProductImageModule;
exports.ProductImageModule = ProductImageModule = __decorate([
    (0, common_1.Module)({
        controllers: [product_image_controller_1.ProductImageController],
        providers: [product_image_service_1.ProductImageService, product_image_repository_1.ProductImageRepository],
        exports: [product_image_service_1.ProductImageService],
    })
], ProductImageModule);
//# sourceMappingURL=product-image.module.js.map