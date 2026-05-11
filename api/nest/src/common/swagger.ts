import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export function setupSwagger(app: INestApplication) {
  try {
    const config = new DocumentBuilder()
      .setTitle('EchelonLiving API')
      .setDescription('REST API documentation for EchelonLiving')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api/docs', app, document);
    console.log('Swagger UI available at /api/docs');
  } catch (error) {
    console.warn('Swagger setup skipped:', error);
  }
}
