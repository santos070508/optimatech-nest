import {
  Controller, Get, Post, Param,
  Body, HttpCode, HttpStatus, ParseIntPipe,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation,
  ApiCreatedResponse, ApiOkResponse,
} from '@nestjs/swagger';
import {
  ListOrdersUseCase,
  GetOrderUseCase,
  CreateOrderUseCase,
} from '../../application/use-cases/order.use-cases';
import { CreateOrderDto } from '../../application/dtos/order.dto';
import { Order }          from '../../domain/order.entity';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {

  constructor(
    private readonly listOrders:   ListOrdersUseCase,
    private readonly getOrder:     GetOrderUseCase,
    private readonly createOrder:  CreateOrderUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos los pedidos' })
  @ApiOkResponse({ description: 'Lista de pedidos' })
  findAll(): Promise<Order[]> {
    return this.listOrders.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener pedido por ID' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Order> {
    return this.getOrder.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo pedido' })
  @ApiCreatedResponse({ description: 'Pedido creado exitosamente' })
  create(@Body() dto: CreateOrderDto): Promise<Order> {
    return this.createOrder.execute(dto);
  }
}
