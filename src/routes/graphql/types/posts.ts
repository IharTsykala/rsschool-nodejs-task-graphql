//types
import {
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { IUser } from './common.js';
import { Context } from './context.js';
import { UUIDType } from './uuid.js';

export const postObject = new GraphQLObjectType({
  name: 'post',
  fields: () => ({
    id: { type: UUIDType },
    authorId: { type: UUIDType },
    title: { type: GraphQLString },
    content: { type: GraphQLString },
  }),
});

export const postsListType = new GraphQLList(postObject);

export const postsQuery = {
  post: {
    type: postObject,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<unknown> => {
      return prisma.post.findUnique({
        where: { id },
      });
    },
  },

  posts: {
    type: postsListType,
    resolve: async (_, __, { prisma }: Context): Promise<unknown> => {
      return prisma.post.findMany();
    },
  },
};
