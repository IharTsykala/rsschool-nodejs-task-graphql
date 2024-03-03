//schemas
import { MemberTypeId } from '../../member-types/schemas.js';

//types
import {
  GraphQLInt,
  GraphQLList,
  GraphQLEnumType,
  GraphQLFloat,
  GraphQLNonNull,
  GraphQLObjectType,
} from 'graphql/type/index.js';
import { IUser } from './common.js';
import { Context } from './context.js';

export const memberTypeEnum = new GraphQLEnumType({
  name: 'MemberTypeId',
  values: {
    basic: {
      value: MemberTypeId.BASIC,
    },
    business: {
      value: MemberTypeId.BUSINESS,
    },
  },
});

export const memberTypeObject = new GraphQLObjectType({
  name: 'memberType',
  fields: () => ({
    id: { type: memberTypeEnum },
    postsLimitPerMonth: { type: GraphQLInt },
    discount: { type: GraphQLFloat },
  }),
});

export const memberTypeQuery = {
  memberType: {
    type: memberTypeObject,
    args: {
      id: {
        type: new GraphQLNonNull(memberTypeEnum),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.memberType.findUnique({
        where: { id },
      });
    },
  },

  memberTypes: {
    type: new GraphQLList(memberTypeObject),
    resolve: async (_, __, { prisma }: Context): Promise<unknown> => {
      return prisma.memberType.findMany();
    },
  },
};
