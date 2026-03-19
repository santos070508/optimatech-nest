import {
  Controller, Get, Post, Put, Patch, Delete,
  Param, Body, Query, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam,
  ApiQuery, ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  ListProductsUseCase,
  GetProductUseCase,
  CreateProductUseCase,
  UpdateProductUseCase,
  DeleteProductUseCase,
} from '../../application/use-cases/product.use-cases';
import {
  CreateProductDto,
  UpdateProductDto,
  ProductFilterDto,
} from '../../application/dtos/product.dto';
import { Product } from '../../domain/product.entity';

@ApiTags('products')
@Controller('products')
export class ProductsController {

  constructor(
    private readonly listProducts:   ListProductsUseCase,
    private readonly getProduct:     GetProductUseCase,
    private readonly createProduct:  CreateProductUseCase,
    private readonly updateProduct:  UpdateProductUseCase,
    private readonly deleteProduct:  DeleteProductUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar productos (con filtros opcionales)' })
  @ApiQuery({ name: 'category', required: false, example: 'peri' })
  @ApiQuery({ name: 'stock',    required: false, enum: ['in-stock', 'low-stock', 'out-stock'] })
  @ApiQuery({ name: 'q',        required: false, description: 'Búsqueda por nombre' })
  @ApiOkResponse({ description: 'Lista de productos' })
  findAll(@Query() filters: ProductFilterDto): Promise<Product[]> {
    return this.listProducts.execute(filters);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener producto por ID' })
  @ApiParam({ name: 'id', example: 'p1abc' })
  findOne(@Param('id') id: string): Promise<Product> {
    return this.getProduct.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear un nuevo producto' })
  @ApiCreatedResponse({ description: 'Producto creado' })
  create(@Body() dto: CreateProductDto): Promise<Product> {
    return this.createProduct.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar producto (completo)' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProduct.execute(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar producto (parcial)' })
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateProductDto,
  ): Promise<Product> {
    return this.updateProduct.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar producto' })
  @ApiNoContentResponse({ description: 'Producto eliminado' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteProduct.execute(id);
  }
}
