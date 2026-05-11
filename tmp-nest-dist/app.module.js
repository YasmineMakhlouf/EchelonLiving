"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const graphql_1 = require("@nestjs/graphql");
const apollo_1 = require("@nestjs/apollo");
const serve_static_1 = require("@nestjs/serve-static");
const path_1 = require("path");
const database_module_1 = require("./config/database.module");
const admin_stats_module_1 = require("./modules/admin-stats/admin-stats.module");
const auth_module_1 = require("./modules/auth/auth.module");
const user_module_1 = require("./modules/user/user.module");
const product_module_1 = require("./modules/product/product.module");
const category_module_1 = require("./modules/category/category.module");
const order_module_1 = require("./modules/order/order.module");
const cart_item_module_1 = require("./modules/cart-item/cart-item.module");
const review_module_1 = require("./modules/review/review.module");
const product_image_module_1 = require("./modules/product-image/product-image.module");
const design_request_module_1 = require("./modules/design-request/design-request.module");
const catalog_events_module_1 = require("./modules/catalog-events/catalog-events.module");
const product_resolver_1 = require("./resolvers/product.resolver");
const auth_resolver_1 = require("./resolvers/auth.resolver");
const order_resolver_1 = require("./resolvers/order.resolver");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            database_module_1.DatabaseModule,
            serve_static_1.ServeStaticModule.forRoot({
                rootPath: process.env.UPLOADS_DIR ?? (0, path_1.join)(__dirname, '..', '..', '..', 'api', 'uploads'),
                serveRoot: '/uploads',
            }),
            graphql_1.GraphQLModule.forRoot({
                driver: apollo_1.ApolloDriver,
                autoSchemaFile: 'schema.gql',
                sortSchema: true,
                introspection: true,
            }),
            admin_stats_module_1.AdminStatsModule,
            auth_module_1.AuthModule,
            user_module_1.UsersModule,
            product_module_1.ProductModule,
            category_module_1.CategoryModule,
            order_module_1.OrderModule,
            cart_item_module_1.CartItemModule,
            review_module_1.ReviewModule,
            product_image_module_1.ProductImageModule,
            design_request_module_1.DesignRequestModule,
            catalog_events_module_1.CatalogEventsModule,
        ],
        providers: [product_resolver_1.ProductResolver, auth_resolver_1.AuthResolver, order_resolver_1.OrderResolver, order_resolver_1.CartResolver],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map