import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsEmail, IsArray,
  IsNumber, IsPositive, IsInt, Min,
  ValidateNested, IsOptional, MaxLength, ArrayMinSize,
} from 'class-validator';
import { Type } from 'class-transformer';

// CustomerDto declarada PRIMERO — evita ReferenceError en runtime
export class CustomerDto {
  @ApiProperty({ example: 'Juan Pérez' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(200)
  name: string;

  @ApiProperty({ example: 'juan@empresa.com' })
  @IsEmail({}, { message: 'Email inválido' })
  email: string;

  @ApiProperty({ example: '0984774484' })
  @IsString()
  @IsNotEmpty({ message: 'El teléfono es obligatorio' })
  phone: string;

  @ApiProperty({ example: 'Calle 123, Quito' })
  @IsString()
  @IsNotEmpty({ message: 'La dirección es obligatoria' })
  address: string;

  @ApiPropertyOptional({ example: 'Entregar en horario de oficina' })
  @IsOptional()
  @IsString()
  notes?: string;
}

export class OrderItemDto {
  @ApiProperty({ example: 'p1abc' })
  @IsString()
  @IsNotEmpty()
  productId: string;

  @ApiProperty({ example: 'Logitech MX Master 3S' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 89.99 })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @Type(() => Number)
  price: number;

  @ApiProperty({ example: 2 })
  @IsInt()
  @Min(1)
  @Type(() => Number)
  qty: number;
}

// CreateOrderDto declarada DESPUÉS de sus dependencias
export class CreateOrderDto {
  @ApiProperty({ description: 'Información del cliente', type: CustomerDto })
  @ValidateNested()
  @Type(() => CustomerDto)
  customer: CustomerDto;

  @ApiProperty({ type: [OrderItemDto] })
  @IsArray()
  @ArrayMinSize(1, { message: 'El pedido debe tener al menos un producto' })
  @ValidateNested({ each: true })
  @Type(() => OrderItemDto)
  items: OrderItemDto[];
}
