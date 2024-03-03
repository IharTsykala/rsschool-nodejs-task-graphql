import { User } from '@prisma/client';

export interface IUser extends User {
  id: string;
  memberTypeId: string;
}
