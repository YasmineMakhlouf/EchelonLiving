"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const core_1 = require("@nestjs/core");
const common_1 = require("@nestjs/common");
const app_module_1 = require("./app.module");
const swagger_1 = require("./common/swagger");
async function bootstrap() {
    try {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        app.enableCors({
            origin: ['http://localhost:5173'],
            credentials: true,
        });
        app.setGlobalPrefix('api/v1');
        app.useGlobalPipes(new common_1.ValidationPipe({ whitelist: true, transform: true }));
        (0, swagger_1.setupSwagger)(app);
        const port = process.env.PORT || 5001;
        await app.listen(port);
        console.log(`✅ NestJS app running on http://localhost:${port}`);
        console.log(`📊 GraphQL endpoint: http://localhost:${port}/api/v1/graphql`);
        console.log(`📋 REST endpoints available under /admin, /auth, /users, /products, etc.`);
    }
    catch (error) {
        console.error('❌ Failed to start application:', error);
        process.exit(1);
    }
}
bootstrap();
//# sourceMappingURL=main.js.map