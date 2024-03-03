//types
import {
  GraphQLFloat,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { profileObject } from './profiles.js';
import { postsListType } from './posts.js';
import { IProfile, ISubscription, IUser } from './common.js';
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

const userInput = new GraphQLInputObjectType({
  name: 'CreateUserInput',
  fields: () => ({
    name: { type: new GraphQLNonNull(GraphQLString) },
    balance: { type: new GraphQLNonNull(GraphQLFloat) },
  }),
});

const changeUserInput = new GraphQLInputObjectType({
  name: 'ChangeUserInput',
  fields: () => ({
    name: { type: GraphQLString },
    balance: { type: GraphQLFloat },
  }),
});

export const usersMutation = {
  createUser: {
    type: userObject as GraphQLObjectType,
    args: {
      dto: {
        type: new GraphQLNonNull(userInput),
      },
    },
    resolve: async (_, { dto }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.user.create({
        data: dto,
      });
    },
  },

  changeUser: {
    type: userObject as GraphQLObjectType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
      dto: {
        type: new GraphQLNonNull(changeUserInput),
      },
    },
    resolve: async (_, { id, dto }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.user.update({
        where: { id },
        data: dto,
      });
    },
  },

  deleteUser: {
    type: UUIDType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<void> => {
      await prisma.user.delete({
        where: { id },
      });
    },
  },

  subscribeTo: {
    type: userObject as GraphQLObjectType,
    args: {
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (
      _,
      { userId, authorId }: ISubscription,
      { prisma }: Context,
    ): Promise<unknown> => {
      return prisma.user.update({
        where: { id: userId },
        data: {
          userSubscribedTo: {
            create: { authorId },
          },
        },
      });
    },
  },

  unsubscribeFrom: {
    type: UUIDType,
    args: {
      userId: {
        type: new GraphQLNonNull(UUIDType),
      },
      authorId: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (
      _,
      { userId, authorId }: ISubscription,
      { prisma }: Context,
    ): Promise<void> => {
      await prisma.subscribersOnAuthors.delete({
        where: {
          subscriberId_authorId: {
            authorId: authorId,
            subscriberId: userId,
          },
        },
      });
    },
  },
};
