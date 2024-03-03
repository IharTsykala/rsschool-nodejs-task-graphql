//types
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLInputObjectType,
} from 'graphql/type/index.js';
import { IProfile, IUser } from './common.js';
import { memberTypeEnum, memberTypeObject } from './member-types.js';
import { Context } from './context.js';
import { UUIDType } from './uuid.js';

export const profileObject = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    userId: { type: UUIDType },
    memberTypeId: { type: memberTypeEnum },
    isMale: { type: GraphQLBoolean },
    yearOfBirth: { type: GraphQLInt },
    memberType: {
      type: memberTypeObject,
      resolve: async (
        { memberTypeId }: IUser,
        _,
        { prisma }: Context,
      ): Promise<unknown> => {
        return prisma.memberType.findUnique({
          where: { id: memberTypeId },
        });
      },
    },
  }),
});

export const profilesQuery = {
  profile: {
    type: profileObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.profile.findUnique({
        where: { id },
      });
    },
  },

  profiles: {
    type: new GraphQLList(profileObject),
    resolve: async (_, __, { prisma }: Context): Promise<unknown> => {
      return prisma.profile.findMany();
    },
  },
};

const profileInput = new GraphQLInputObjectType({
  name: 'CreateProfileInput',
  fields: () => ({
    userId: { type: new GraphQLNonNull(UUIDType) },
    memberTypeId: { type: new GraphQLNonNull(memberTypeEnum) },
    isMale: { type: new GraphQLNonNull(GraphQLBoolean) },
    yearOfBirth: { type: new GraphQLNonNull(GraphQLInt) },
  }),
});

export const profilesMutation = {
  createProfile: {
    type: profileObject as GraphQLObjectType,
    args: {
      dto: {
        type: new GraphQLNonNull(profileInput),
      },
    },
    resolve: async (_, { dto }: IProfile, { prisma }: Context): Promise<unknown> => {
      return prisma.profile.create({
        data: dto,
      });
    },
  },

  deleteProfile: {
    type: UUIDType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<void> => {
      await prisma.profile.delete({
        where: { id },
      });
    },
  },
};
