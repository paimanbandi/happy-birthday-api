import { HttpService } from '@nestjs/axios';
import { InjectQueue, Process, Processor } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue } from 'bull';
import { CreateEmailCacheDTO } from 'src/dto/create-email-cache.dto';
import { EmailCacheRepository } from 'src/modules/email-caches/email-cache.repository';

@Injectable()
@Processor('email')
export class EmailWorker {
  private readonly logger = new Logger(EmailWorker.name);

  constructor(
    private readonly emailCacheRepository: EmailCacheRepository,
    private readonly httpService: HttpService,
    @InjectQueue('email') private readonly queue: Queue,
  ) {}

  generateEmailIdentifier(req: any): string {
    return `${req.todayUserBirthday}-${req.email}-${req.message}`;
  }

  @Process()
  async sendEmail(job: any): Promise<void> {
    try {
      const { email, message } = job.data;

      const identifier = this.generateEmailIdentifier(job.data);
      const emailCache =
        await this.emailCacheRepository.findByIdentifier(identifier);
      if (emailCache) {
        this.logger.debug(`Email already sent before: ${identifier}`);
        return;
      }
      const headers = {
        accept: 'application/json',
        'Content-Type': 'application/json',
      };
      const res = await this.httpService
        .post(
          'https://email-service.digitalenvision.com.au/send-email',
          {
            email,
            message,
          },
          { headers },
        )
        .toPromise();
      this.logger.debug('Response of Sending Email:', res.data);
      if (res.data.status === 'sent') {
        const emailCacheDto: CreateEmailCacheDTO = {
          identifier,
        };

        const emailCacheData =
          await this.emailCacheRepository.create(emailCacheDto);
        this.logger.debug(`Email sent: ${emailCacheData}`);
      }
    } catch (error) {
      this.logger.error(`Failed to send email: ${error.stack}`);
      throw error;
    }
  }
}
