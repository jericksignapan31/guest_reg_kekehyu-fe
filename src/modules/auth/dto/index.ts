import { IsEmail, IsString, MinLength, IsEnum, IsOptional } from 'class-validator';
import { UserRole } from '../../../entities';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'SecurePass123!' })
  @IsString()
  password!: string;
}

export class RegisterDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'Michael', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: '09171234567' })
  @IsString()
  contactNumber!: string;

  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({
    example: 'SecurePass123!',
    description:
      'Password must be at least 12 characters and contain uppercase, lowercase, numbers, and special characters',
  })
  @IsString()
  @MinLength(12)
  password!: string;

  @ApiProperty({ enum: UserRole, example: UserRole.FRONTDESK, required: false })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;
}

export class RefreshTokenDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' })
  @IsString()
  refreshToken!: string;
}

export class PasswordResetRequestDto {
  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  email!: string;
}

export class PasswordResetDto {
  @ApiProperty({ example: 'reset_token_from_email' })
  @IsString()
  resetToken!: string;

  @ApiProperty({
    example: 'NewSecurePass123!',
    description:
      'Password must be at least 12 characters and contain uppercase, lowercase, numbers, and special characters',
  })
  @IsString()
  @MinLength(12)
  newPassword!: string;
}
