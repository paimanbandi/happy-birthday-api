import {
  BadRequestException,
  ConflictException,
  Injectable,
  Logger,
} from '@nestjs/common';
import { UserRepository } from './user.repository';
import { CreateUserDTO } from 'src/dto/create-user.dto';
import { Cron, CronExpression } from '@nestjs/schedule';
import * as moment from 'moment-timezone';
import { EmailQueue } from 'src/queue/email.queue';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';
import { UpdateUserDTO } from 'src/dto/update-user.dto';
import { HydratedUser, User } from 'src/schemas/user.schema';
import { isValidStringObjectId } from 'src/validators/string-object-id.validator';

@Injectable()
export class UserService {
  private isSendingEmails = false;
  private readonly batchSize = 100;
  private readonly concurrency = 10;

  constructor(
    private readonly userRepository: UserRepository,
    private readonly emailQueue: EmailQueue,
  ) {}

  private readonly logger = new Logger(UserService.name);

  async create(dto: CreateUserDTO) {
    const user = await this.userRepository.findByEmail(dto.email);
    if (user) {
      throw new ConflictException('User already exists');
    }
    return await this.userRepository.create(dto);
  }

  async sendBirthdayEmail(user: Partial<User>, today: moment.Moment) {
    const { firstName, lastName, email, birthdayDate, location } = user;
    const todayUserBirthday = moment(birthdayDate)
      .year(today.year())
      .tz(location);

    const currentTime = moment().tz(location);

    if (
      currentTime.hour() >= 9 &&
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
        this.logger.debug(req);

        await this.emailQueue.addEmailTask(req);
      } catch (error) {
        console.error('Failed to send birthday email:', error.response);
      }
    }
  }

  @Cron(CronExpression.EVERY_MINUTE)
  async handleCronToSendBirthdayEmails() {
    if (this.isSendingEmails) {
      this.logger.debug(
        'Email sending is already in progress. Skipping this execution.',
      );
      return;
    }
    try {
      this.isSendingEmails = true;

      const users = await this.find();
      const today = moment();
      for (let i = 0; i < users.length; i += this.batchSize) {
        const batchUsers = users.slice(i, i + this.batchSize);

        const tasks = batchUsers.map(
          (user) => () => this.sendBirthdayEmail(user, today),
        );
        await this.limitConcurrency(tasks, this.concurrency);
      }
    } finally {
      this.isSendingEmails = false;
    }
  }

  private async limitConcurrency(
    tasks: (() => Promise<any>)[],
    concurrency: number,
  ) {
    const results = [];
    const runningTasks = [];

    for (const task of tasks) {
      if (runningTasks.length >= concurrency) {
        await Promise.race(runningTasks);
      }

      const taskPromise = task();
      runningTasks.push(taskPromise);
      const result = await taskPromise;

      results.push(result);

      const index = runningTasks.indexOf(taskPromise);
      runningTasks.splice(index, 1);
    }

    await Promise.all(runningTasks);

    return results;
  }

  async find(): Promise<HydratedUser[]> {
    return await this.userRepository.find();
  }

  async findById(id: string): Promise<HydratedUser> {
    return await this.userRepository.findById(id);
  }

  async deleteOne(dto: DeleteUserDTO) {
    if (!isValidStringObjectId(dto._id)) {
      throw new BadRequestException('Please input the valid _id');
    }
    const user = await this.findById(dto._id);
    if (user) {
      return await this.userRepository.deleteOne(dto);
    }
    throw new BadRequestException(`User with _id ${dto._id} not found`);
  }

  async update(id: string, dto: UpdateUserDTO) {
    if (!isValidStringObjectId(id)) {
      throw new BadRequestException('Please input the valid _id');
    }
    const user = await this.findById(id);
    if (user) {
      return await this.userRepository.update(id, dto);
    }
    throw new BadRequestException(`User with _id ${id} not found`);
  }
}
