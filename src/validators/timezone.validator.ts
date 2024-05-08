import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsTimeZoneFormat(validationOptions?: ValidationOptions) {
  return function (object: any, propertyName: string) {
    registerDecorator({
      name: 'isTimeZoneFormat',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          // Regular expression to match timezone format (Continent/City)
          const timeZoneRegex = /^[a-zA-Z]+\/[a-zA-Z_]+$/;
          return typeof value === 'string' && timeZoneRegex.test(value);
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be in the format Continent/City (e.g. Asia/Jakarta)`;
        },
      },
    });
  };
}
