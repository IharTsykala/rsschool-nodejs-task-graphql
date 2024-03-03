import { Type } from '@fastify/type-provider-typebox';

import { GraphQLObjectType, GraphQLSchema } from 'graphql/type/index.js';

//types
import { usersQuery } from './types/users.js';
import { memberTypeQuery } from './types/member-types.js';
import { profilesQuery } from './types/profiles.js';
import { postsMutation, postsQuery } from './types/posts.js';

export const gqlResponseSchema = Type.Partial(
  Type.Object({
    data: Type.Any(),
    errors: Type.Any(),
  }),
);

export const createGqlResponseSchema = {
  body: Type.Object(
    {
      query: Type.String(),
      variables: Type.Optional(Type.Record(Type.String(), Type.Any())),
    },
    {
      additionalProperties: false,
    },
  ),
};

export const query = new GraphQLObjectType({
  name: 'Query',
  fields: () => ({
    ...usersQuery,
    ...memberTypeQuery,
    ...profilesQuery,
    ...postsQuery,
  }),
});

export const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: () => ({
    ...postsMutation,
  }),
});

export const schema = new GraphQLSchema({
  query,
});
