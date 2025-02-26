import { IsUniqueEmail } from '../validation/unique-email.validator';
import { IsEmail } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsUniqueEmail({ message: 'Invalid or already existent email' })
  email: string;
}
