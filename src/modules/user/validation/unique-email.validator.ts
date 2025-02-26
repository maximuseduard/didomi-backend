import { UserService } from '../user.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';

@Injectable()
@ValidatorConstraint({ async: true })
export class UniqueEmail implements ValidatorConstraintInterface {
  constructor(private userService: UserService) {}

  async validate(value: string): Promise<boolean> {
    try {
      const user = await this.userService.findOne({ email: value });

      return !user;
    } catch (err) {
      if (err instanceof NotFoundException) {
        return true;
      }

      throw err;
    }
  }
}

export const IsUniqueEmail = (validationOptions?: ValidationOptions) => {
  return (object: object, prop: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName: prop,
      options: validationOptions,
      constraints: [],
      validator: UniqueEmail,
    });
  };
};
