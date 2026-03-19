import { Module }        from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderOrmEntity }           from './infrastructure/persistence/order.orm-entity';
import { OrderTypeOrmRepository }   from './infrastructure/persistence/order-typeorm.repository';
import { OrdersController }         from './infrastructure/http/orders.controller';
import { ORDER_REPOSITORY }         from './domain/order.repository.port';
import {
  ListOrdersUseCase,
  GetOrderUseCase,
  CreateOrderUseCase,
} from './application/use-cases/order.use-cases';

const USE_CASES = [ListOrdersUseCase, GetOrderUseCase, CreateOrderUseCase];

@Module({
  imports:     [TypeOrmModule.forFeature([OrderOrmEntity])],
  controllers: [OrdersController],
  providers: [
    ...USE_CASES,
    { provide: ORDER_REPOSITORY, useClass: OrderTypeOrmRepository },
  ],
})
export class OrdersModule {}
