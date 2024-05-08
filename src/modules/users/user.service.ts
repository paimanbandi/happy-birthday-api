import { Injectable, Logger } from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { EmailQueue } from 'src/queue/email.queue';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';

@Injectable()
export class UserService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailQueue: EmailQueue,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async create(dto: CreateUserDTO) {
    return this.userRepository.create(dto);
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronToSendBirthdayEmails() {
    const users = await this.userRepository.find();
    this.logger.debug('users');
    this.logger.debug(users);
    const today = moment();
    users.forEach(async (user) => {
      const { firstName, lastName, email, birthdayDate, location } = user;
      const todayUserBirthday = moment(birthdayDate)
        .year(today.year())
        .tz(location);

      const currentTime = moment().tz(location);

      if (
        currentTime.hour() >= 18 &&
        currentTime.hour() < 24 &&
        currentTime.minute() >= 0 &&
        todayUserBirthday.date() === currentTime.date() &&
        todayUserBirthday.month() === currentTime.month()
      ) {
        try {
          const fullName = `${firstName} ${lastName}`;
          const message = `Hey, ${fullName} it’s your birthday!`;
          const req = {
            email,
            message,
            todayUserBirthday: todayUserBirthday.toString(),
          };
          this.logger.debug('[handleCronToSendBirthdayEmails]', req);

          await this.emailQueue.addEmailTask(req);
        } catch (error) {
          console.error('Failed to send birthday email:', error.response);
        }
      }
    });
  }

  async delete(dto: DeleteUserDTO) {
    return this.userRepository.delete(dto);
  }
}
