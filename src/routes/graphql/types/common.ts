import { User } from '@prisma/client';

export interface IUser extends User {
  id: string;
  memberTypeId: string;
}

export interface IPostDTO {
  authorId: string;
  title: string;
  content: string;
}

export interface IPost {
  dto: IPostDTO;
}
