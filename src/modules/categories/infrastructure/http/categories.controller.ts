import {
  Controller, Get, Post, Put, Patch,
  Delete, Param, Body, HttpCode, HttpStatus,
} from '@nestjs/common';
import {
  ApiTags, ApiOperation, ApiParam,
  ApiCreatedResponse, ApiOkResponse, ApiNoContentResponse,
} from '@nestjs/swagger';
import {
  ListCategoriesUseCase,
  GetCategoryUseCase,
  CreateCategoryUseCase,
  UpdateCategoryUseCase,
  DeleteCategoryUseCase,
} from '../../application/use-cases/category.use-cases';
import { CreateCategoryDto, UpdateCategoryDto } from '../../application/dtos/category.dto';
import { Category } from '../../domain/category.entity';

/**
 * CONTROLLER — solo se encarga del protocolo HTTP.
 * No tiene lógica de negocio. Delega todo a los use cases.
 */
@ApiTags('categories')
@Controller('categories')
export class CategoriesController {

  constructor(
    private readonly listCategories:   ListCategoriesUseCase,
    private readonly getCategory:      GetCategoryUseCase,
    private readonly createCategory:   CreateCategoryUseCase,
    private readonly updateCategory:   UpdateCategoryUseCase,
    private readonly deleteCategory:   DeleteCategoryUseCase,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas las categorías' })
  @ApiOkResponse({ description: 'Lista de categorías' })
  findAll(): Promise<Category[]> {
    return this.listCategories.execute();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener una categoría por ID' })
  @ApiParam({ name: 'id', example: 'peri' })
  @ApiOkResponse({ description: 'Categoría encontrada' })
  findOne(@Param('id') id: string): Promise<Category> {
    return this.getCategory.execute(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Crear una nueva categoría' })
  @ApiCreatedResponse({ description: 'Categoría creada exitosamente' })
  create(@Body() dto: CreateCategoryDto): Promise<Category> {
    return this.createCategory.execute(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar categoría (reemplazo completo)' })
  @ApiParam({ name: 'id', example: 'peri' })
  @ApiOkResponse({ description: 'Categoría actualizada' })
  update(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.updateCategory.execute(id, dto);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Actualizar categoría (actualización parcial)' })
  @ApiParam({ name: 'id', example: 'peri' })
  partialUpdate(
    @Param('id') id: string,
    @Body() dto: UpdateCategoryDto,
  ): Promise<Category> {
    return this.updateCategory.execute(id, dto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Eliminar una categoría' })
  @ApiParam({ name: 'id', example: 'peri' })
  @ApiNoContentResponse({ description: 'Categoría eliminada' })
  async remove(@Param('id') id: string): Promise<void> {
    await this.deleteCategory.execute(id);
  }
}
