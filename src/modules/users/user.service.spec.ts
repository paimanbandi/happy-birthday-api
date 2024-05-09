import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { getModelToken } from '@nestjs/mongoose';
import { NestUserProvider, User } from 'src/schemas/user.schema';
import { Model, Types } from 'mongoose';
import { EmailQueue } from 'src/queue/email.queue';
import { EmailWorker } from 'src/workers/email.worker';
import { DatabaseModule } from 'src/config/db/module.db';
import { EmailCacheRepository } from '../email-caches/email-cache.repository';
import { NestEmailCacheProvider } from 'src/schemas/email-cache.schema';
import { UserController } from './user.controller';
import { BullModule } from '@nestjs/bull';
import { HttpModule } from '@nestjs/axios';

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

  const mockUser = {
    _id: new Types.ObjectId('663bb377fe3fa039464ceb28'),
    firstName: 'Paiman',
    lastName: 'Bandi',
    email: 'paiman.bandi@gmail.com',
    birthdayDate: '1988-05-09',
    location: 'Asia/Jakarta',
  };
  const mockUserService = {
    create: jest.fn(),
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
      jest.spyOn(model, 'create').mockResolvedValue(mockUser as any);
      const result = await userService.create(createUserDTO);
      console.debug('createUserDTO', createUserDTO);
      console.debug('result', result);
      expect(result).toEqual(expect.objectContaining(createUserDTO));
    });
  });
});
