import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { setupSwagger } from './common/swagger';

async function bootstrap() {
  try {
    const app = await NestFactory.create(AppModule);
    app.enableCors({
      origin: ['http://localhost:5173', 'http://localhost:5174'],
      credentials: true,
    });
    app.setGlobalPrefix('api/v1');
    app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));
    setupSwagger(app);
    const port = process.env.PORT || 5001;
    await app.listen(port as any);
    console.log(`NestJS app running on http://localhost:${port}`);
    console.log(`GraphQL endpoint: http://localhost:${port}/api/v1/graphql`);
    console.log(`REST endpoints available under /admin, /auth, /users, /products, etc.`);
  } catch (error) {
    console.error('Failed to start application:', error);
    process.exit(1);
  }
}

bootstrap();
