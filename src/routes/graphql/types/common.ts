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
  id: string;
  dto: IProfileDTO;
}

interface IPostDTO {
  authorId: string;
  title: string;
  content: string;
}

export interface IPost {
  id: string;
  dto: IPostDTO;
}

export interface ISubscription
  extends Pick<IProfileDTO, 'userId'>,
    Pick<IPostDTO, 'authorId'> {}
