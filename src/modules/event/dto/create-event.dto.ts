import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { EventId } from '../enum/event-id.enum';
import { Type } from 'class-transformer';

class UserDto {
  @IsUUID()
  id: string;
}

class ConsentDto {
  @IsEnum(EventId)
  id: string;

  @IsBoolean()
  enabled: boolean;
}

export class CreateEventDto {
  @ValidateNested()
  @Type(() => UserDto)
  user: UserDto;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ConsentDto)
  consents: ConsentDto[];
}
