import { IsString, IsEmail, IsDate, IsOptional, IsArray, ValidateNested, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateGuestDto {
  @ApiProperty({ example: 'Cherille' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Antonio' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'Marie', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: '0917826895' })
  @IsString()
  phone!: string;

  @ApiProperty({ example: 'cherille@example.com' })
  @IsEmail()
  email!: string;

  @ApiProperty({ example: 'Philippines' })
  @IsString()
  country!: string;

  @ApiProperty({ example: '12345678', required: false })
  @IsString()
  @IsOptional()
  idNumber?: string;

  @ApiProperty({ example: 'Passport', required: false })
  @IsString()
  @IsOptional()
  idType?: string;
}

export class AccompanyingGuestDto {
  @ApiProperty({ example: 'John' })
  @IsString()
  firstName!: string;

  @ApiProperty({ example: 'Doe' })
  @IsString()
  lastName!: string;

  @ApiProperty({ example: 'Smith', required: false })
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty({ example: true })
  @IsBoolean()
  validIdPresented!: boolean;

  @ApiProperty({ example: 'ID', required: false })
  @IsString()
  @IsOptional()
  idType?: string;

  @ApiProperty({ example: '87654321', required: false })
  @IsString()
  @IsOptional()
  idNumber?: string;

  @ApiProperty({ example: 'base64_signature_string', required: false })
  @IsString()
  @IsOptional()
  signature?: string;
}

export class PolicyAcknowledgmentDto {
  @ApiProperty({ example: true })
  @IsBoolean()
  makeUpRoom!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  housekeepingStaff!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  smoking!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  corkage!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  noPets!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  damageDeductible!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  minorsCare!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  digitalSafe!: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  dataPrivacy!: boolean;

  @ApiProperty({ example: 'base64_signature_string', required: false })
  @IsString()
  @IsOptional()
  guestSignature?: string;
}

export class RoomDto {
  @ApiProperty({ example: 'DELUXE DOUBLE' })
  @IsString()
  roomType!: string;

  @ApiProperty({ example: '408' })
  @IsString()
  roomNumber!: string;

  @ApiProperty({ example: '14:00:00', required: false })
  @IsString()
  @IsOptional()
  checkInTime?: string;

  @ApiProperty({ example: '11:00:00', required: false })
  @IsString()
  @IsOptional()
  checkOutTime?: string;
}

export class CreateReservationDto {
  @ApiProperty({ example: '2024-04-15' })
  @Type(() => Date)
  @IsDate()
  checkInDate!: Date;

  @ApiProperty({ example: '2024-04-20' })
  @Type(() => Date)
  @IsDate()
  checkOutDate!: Date;

  @ApiProperty({ type: [RoomDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RoomDto)
  rooms!: RoomDto[];

  @ApiProperty({ example: 'ABC-123', required: false })
  @IsString()
  @IsOptional()
  vehiclePlateNumber?: string;

  @ApiProperty({ type: CreateGuestDto })
  @ValidateNested()
  @Type(() => CreateGuestDto)
  guest!: CreateGuestDto;

  @ApiProperty({ type: [AccompanyingGuestDto], required: false })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AccompanyingGuestDto)
  @IsOptional()
  accompanyingGuests?: AccompanyingGuestDto[];

  @ApiProperty({ type: PolicyAcknowledgmentDto })
  @ValidateNested()
  @Type(() => PolicyAcknowledgmentDto)
  policies!: PolicyAcknowledgmentDto;
}
