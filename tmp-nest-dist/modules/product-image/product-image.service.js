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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProductImageService = void 0;
const common_1 = require("@nestjs/common");
const product_image_repository_1 = require("./product-image.repository");
let ProductImageService = class ProductImageService {
    constructor(repo) {
        this.repo = repo;
    }
    async listForProduct(productId) {
        return this.repo.query('SELECT id, product_id, image_url, created_at FROM product_images WHERE product_id = $1 ORDER BY created_at DESC', [productId]);
    }
};
exports.ProductImageService = ProductImageService;
exports.ProductImageService = ProductImageService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [product_image_repository_1.ProductImageRepository])
], ProductImageService);
//# sourceMappingURL=product-image.service.js.map