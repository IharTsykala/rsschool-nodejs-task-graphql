//types
import {
  GraphQLFloat,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { profileObject } from './profiles.js';
import { postsListType } from './posts.js';
import { IUser } from './common.js';
import { Context } from './context.js';

//uuid
import { UUIDType } from './uuid.js';

export const userObject = new GraphQLObjectType({
  name: 'user',
  fields: () => ({
    id: { type: UUIDType },
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
    profile: {
      type: profileObject,
      resolve: async ({ id }: IUser, _, { prisma }: Context): Promise<unknown> => {
        return prisma.profile.findUnique({ where: { userId: id } });
      },
    },

    posts: {
      type: postsListType,
      resolve: async ({ id }: IUser, _, { prisma }: Context): Promise<unknown> => {
        return prisma.post.findMany({ where: { authorId: id } });
      },
    },

    userSubscribedTo: {
      type: new GraphQLList(userObject),
      resolve: async ({ id }: IUser, _, { prisma }: Context): Promise<unknown> => {
        return prisma.user.findMany({
          where: { subscribedToUser: { some: { subscriberId: id } } },
        });
      },
    },

    subscribedToUser: {
      type: new GraphQLList(userObject),
      resolve: async ({ id }: IUser, _, { prisma }: Context): Promise<unknown> => {
        return prisma.user.findMany({
          where: { userSubscribedTo: { some: { authorId: id } } },
        });
      },
    },
  }),
});

export const usersQuery = {
  user: {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    type: userObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.user.findUnique({
        where: { id },
      });
    },
  },

  users: {
    type: new GraphQLList(userObject),
    resolve: async (_, __, { prisma }: Context): Promise<unknown> => {
      return prisma.user.findMany();
    },
  },
};
