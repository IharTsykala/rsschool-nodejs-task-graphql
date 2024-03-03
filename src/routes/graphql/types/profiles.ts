//types
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLInt,
} from 'graphql/type/index.js';
import { IUser } from './common.js';
import { memberTypeObject } from './member-types.js';
import { Context } from './context.js';
import { UUIDType } from './uuid.js';

export const profileObject = new GraphQLObjectType({
  name: 'profile',
  fields: () => ({
    id: { type: UUIDType },
    userId: { type: UUIDType },
    memberTypeId: { type: UUIDType },
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
