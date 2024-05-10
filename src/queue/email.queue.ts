import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Queue, Job } from 'bull';

@Injectable()
export class EmailQueue {
  private readonly logger = new Logger(EmailQueue.name);

  constructor(@InjectQueue('birthday_email') private readonly queue: Queue) {
    this.listenToFailures();
  }

  async addEmailTask(data: any): Promise<Job<any>> {
    return await this.queue.add(data);
  }

  private listenToFailures() {
    this.queue.on('failed', async (job, error) => {
      console.error(`Job ${job.id} failed with error:`, error);
      this.logger.debug(error.stack);
      await this.recoverUnsentMessage(job);
    });
  }

  async recoverUnsentMessage(job: Job) {
    try {
      await job.retry();
      this.logger.debug(`Retrying job ${job.id}: ${job.name}`);
      this.logger.debug(`${job.log}`);
    } catch (error) {
      console.error(`Failed to retry job ${job.id}:`, error);
    }
  }
}
