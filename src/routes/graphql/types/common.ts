import { User } from '@prisma/client';

export interface IUser extends User {
  id: string;
  memberTypeId: string;
}

interface IPostDTO {
  authorId: string;
  title: string;
  content: string;
}

export interface IPost {
  dto: IPostDTO;
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
