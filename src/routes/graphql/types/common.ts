import { User } from '@prisma/client';

interface IUserDTO {
  name: string;
  balance: number;
}

export interface IUser extends User {
  id: string;
  memberTypeId: string;
  dto: IUserDTO;
}

interface IProfileDTO {
  userId: string;
  memberTypeId: string;
  isMale: boolean;
  yearOfBirth: number;
}

export interface IProfile {
  dto: IProfileDTO;
}

interface IPostDTO {
  authorId: string;
  title: string;
  content: string;
}

export interface IPost {
  dto: IPostDTO;
}
