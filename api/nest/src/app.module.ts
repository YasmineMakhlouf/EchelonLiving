import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { DatabaseModule } from './config/database.module';
import { AdminStatsModule } from './modules/admin-stats/admin-stats.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { CategoryModule } from './modules/category/category.module';
import { OrderModule } from './modules/order/order.module';
import { CartItemModule } from './modules/cart-item/cart-item.module';
import { ReviewModule } from './modules/review/review.module';
import { ProductImageModule } from './modules/product-image/product-image.module';
import { DesignRequestModule } from './modules/design-request/design-request.module';
import { CatalogEventsModule } from './modules/catalog-events/catalog-events.module';
import { ProductResolver } from './resolvers/product.resolver';
import { AuthResolver } from './resolvers/auth.resolver';
import { OrderResolver, CartResolver } from './resolvers/order.resolver';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    ServeStaticModule.forRoot({
      rootPath: process.env.UPLOADS_DIR ?? join(__dirname, '..', '..', '..', 'api', 'uploads'),
      serveRoot: '/uploads',
    }),
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: 'schema.gql',
      sortSchema: true,
      introspection: true,
      useGlobalPrefix: true,
    }),
    AdminStatsModule,
    AuthModule,
    UsersModule,
    ProductModule,
    CategoryModule,
    OrderModule,
    CartItemModule,
    ReviewModule,
    ProductImageModule,
    DesignRequestModule,
    CatalogEventsModule,
  ],
  providers: [ProductResolver, AuthResolver, OrderResolver, CartResolver],
})
export class AppModule {}
