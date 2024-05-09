import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { NestUserProvider, User } from 'src/schemas/user.schema';
import { Model } from 'mongoose';
import { EmailQueue } from 'src/queue/email.queue';
import { EmailWorker } from 'src/workers/email.worker';
import { DatabaseModule } from 'src/config/db/module.db';
import { EmailCacheRepository } from '../email-caches/email-cache.repository';
import { NestEmailCacheProvider } from 'src/schemas/email-cache.schema';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';
import { DeleteUserDTO } from 'src/dto/delete-user.dto';

const firstNames: string[] = [
  'John',
  'Jane',
  'Michael',
  'Emily',
  'David',
  'Sarah',
  'James',
  'Emma',
  'Christopher',
  'Olivia',
];
const lastNames: string[] = [
  'Smith',
  'Johnson',
  'Williams',
  'Jones',
  'Peter',
  'Davis',
  'Miller',
  'Wilson',
  'Moore',
  'Taylor',
];

function generateRandomEmail(): string {
  const usernameLength = Math.floor(Math.random() * (10 - 5 + 1)) + 5;
  const domainLength = Math.floor(Math.random() * (10 - 5 + 1)) + 5;

  const username = [...Array(usernameLength)]
    .map(() => Math.random().toString(36)[2])
    .join('');
  const domain = [...Array(domainLength)]
    .map(() => Math.random().toString(36)[2])
    .join('');

  return `${username}@${domain}.com`;
}

function generateRandomBirthday(): string {
  const year = Math.floor(Math.random() * (2024 - 1950 + 1)) + 1950;
  const month = Math.floor(Math.random() * 12) + 1;
  const day = Math.floor(Math.random() * 31) + 1;

  const formattedMonth = month < 10 ? `0${month}` : `${month}`;
  const formattedDay = day < 10 ? `0${day}` : `${day}`;

  return `${year}-${formattedMonth}-${formattedDay}`;
}

function generateRandomTimezone(): string {
  const timezones = [
    // Asia
    'Asia/Jakarta',
    'Asia/Tokyo',
    'Asia/Shanghai',
    'Asia/Singapore',
    'Asia/Kolkata',
    // Africa
    'Africa/Cairo',
    'Africa/Johannesburg',
    'Africa/Lagos',
    'Africa/Nairobi',
    'Africa/Casablanca',
    // America
    'America/New_York',
    'America/Los_Angeles',
    'America/Chicago',
    'America/Toronto',
    'America/Mexico_City',
    // Europe
    'Europe/London',
    'Europe/Paris',
    'Europe/Berlin',
    'Europe/Moscow',
    'Europe/Istanbul',
    // Oceania
    'Pacific/Sydney',
    'Pacific/Auckland',
    'Pacific/Honolulu',
    'Pacific/Fiji',
    'Pacific/Guam',
  ];

  const randomIndex = Math.floor(Math.random() * timezones.length);
  return timezones[randomIndex];
}

describe('UserService', () => {
  let userService: UserService;
  let model: Model<User>;

  const createUserDTO = {
    firstName: firstNames[Math.floor(Math.random() * firstNames.length)],
    lastName: lastNames[Math.floor(Math.random() * lastNames.length)],
    email: generateRandomEmail(),
    birthdayDate: generateRandomBirthday(),
    location: generateRandomTimezone(),
  };

  const mockUserService = {
    create: jest.fn(),
    find: jest.fn(),
    deleteOne: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        DatabaseModule,
        HttpModule,
        BullModule.registerQueue({ name: 'email' }),
      ],
      controllers: [UserController],
      providers: [
        NestUserProvider,
        NestEmailCacheProvider,
        UserService,
        UserRepository,
        EmailCacheRepository,
        EmailQueue,
        EmailWorker,
        {
          provide: getModelToken(User.name),
          useValue: mockUserService,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    model = module.get<Model<User>>(getModelToken(User.name));
  });

  describe('create', () => {
    it('should create a user and return data containing the properties specified in the createUserDTO', async () => {
      jest.spyOn(model, 'create').mockResolvedValue(createUserDTO as any);
      const result = await userService.create(createUserDTO);
      console.debug('createUserDTO', createUserDTO);
      console.debug('result', result);
      expect(result).toEqual(expect.objectContaining(createUserDTO));
    });
  });

  describe('delete', () => {
    it('should delete a user and return the deleted data', async () => {
      jest.spyOn(model, 'find').mockResolvedValue([]);
      const usersList = await userService.find();
      const deleteUserDTO: DeleteUserDTO = {
        _id: usersList[0]._id.toString(),
      };
      const mockResult = {
        acknowledged: true,
        deletedCount: 1,
      };
      jest.spyOn(model, 'deleteOne').mockResolvedValue(mockResult);

      const response = await userService.deleteOne(deleteUserDTO);
      console.debug(response);
      expect(response.deletedCount).toBe(1);
    });
  });
});
