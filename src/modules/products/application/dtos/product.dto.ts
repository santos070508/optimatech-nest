import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsNumber, IsPositive,
  IsEnum, IsOptional, IsArray, MaxLength,
  ArrayMaxSize, IsUrl,
} from 'class-validator';
import { Type } from 'class-transformer';
import { StockStatus } from '../../domain/product.entity';

export class CreateProductDto {
  @ApiProperty({ example: 'Logitech MX Master 3S' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'peri', description: 'ID de la categoría' })
  @IsString()
  @IsNotEmpty({ message: 'La categoría es obligatoria' })
  categoryId: string;

  @ApiProperty({ example: 89.99 })
  @IsNumber({ maxDecimalPlaces: 2 }, { message: 'Precio inválido' })
  @IsPositive({ message: 'El precio debe ser positivo' })
  @Type(() => Number)
  price: number;

  @ApiProperty({ enum: ['in-stock', 'low-stock', 'out-stock'], example: 'in-stock' })
  @IsEnum(['in-stock', 'low-stock', 'out-stock'], {
    message: 'Stock debe ser: in-stock, low-stock u out-stock',
  })
  stock: StockStatus;

  @ApiPropertyOptional({ example: 'Nuevo' })
  @IsOptional()
  @IsString()
  @MaxLength(60)
  badge?: string;

  @ApiPropertyOptional({ example: 'Mouse ergonómico de alto rendimiento' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ example: ['Bluetooth', 'USB-C', '8000 DPI'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @ArrayMaxSize(8)
  specs?: string[];

  @ApiPropertyOptional({ example: ['https://ejemplo.com/img1.jpg'] })
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(5)
  images?: string[];
}

export class UpdateProductDto extends PartialType(CreateProductDto) {}

export class ProductFilterDto {
  @ApiPropertyOptional({ description: 'Filtrar por categoría' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ enum: ['in-stock', 'low-stock', 'out-stock'] })
  @IsOptional()
  @IsString()
  stock?: string;

  @ApiPropertyOptional({ description: 'Búsqueda por nombre' })
  @IsOptional()
  @IsString()
  q?: string;
}
