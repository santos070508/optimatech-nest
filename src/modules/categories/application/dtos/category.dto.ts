import { ApiProperty, ApiPropertyOptional, PartialType } from '@nestjs/swagger';
import {
  IsString, IsNotEmpty, IsOptional,
  MaxLength, Matches,
} from 'class-validator';

export class CreateCategoryDto {
  @ApiProperty({ example: 'Periféricos', description: 'Nombre de la categoría' })
  @IsString()
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(120)
  label: string;

  @ApiProperty({ example: '🖱️', description: 'Emoji icono' })
  @IsString()
  @IsNotEmpty({ message: 'El ícono es obligatorio' })
  @MaxLength(10)
  icon: string;

  @ApiPropertyOptional({ example: 'Mouse, teclados, auriculares y más' })
  @IsOptional()
  @IsString()
  @MaxLength(300)
  description?: string;

  @ApiProperty({ example: '#FF6200', description: 'Color hexadecimal' })
  @IsString()
  @Matches(/^#([0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/, {
    message: 'El color debe ser un código hexadecimal válido (ej: #FF6200)',
  })
  color: string;
}

export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}
