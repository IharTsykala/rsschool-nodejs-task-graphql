//types
import {
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLObjectType,
  GraphQLString,
} from 'graphql/type/index.js';
import { IPost, IUser } from './common.js';
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

export const postInputObject = new GraphQLInputObjectType({
  name: 'CreatePostInput',
  fields: () => ({
    authorId: { type: new GraphQLNonNull(UUIDType) },
    title: { type: new GraphQLNonNull(GraphQLString) },
    content: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

export const postsMutation = {
  createPost: {
    type: postObject,
    args: {
      dto: {
        type: new GraphQLNonNull(postInputObject),
      },
    },

    resolve: async (_, { dto }: IPost, { prisma }: Context): Promise<unknown> => {
      return prisma.post.create({
        data: dto,
      });
    },
  },

  deletePost: {
    type: UUIDType,
    args: {
      id: {
        type: new GraphQLNonNull(UUIDType),
      },
    },
    resolve: async (_, { id }: IUser, { prisma }: Context): Promise<void> => {
      await prisma.post.delete({
        where: { id },
      });
    },
  },
};
