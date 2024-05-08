import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class SendEmailDTO {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  message: string;
}
