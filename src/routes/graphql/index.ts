import { graphql } from 'graphql';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

//schemas
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify) => {
  const { prisma } = fastify;

  fastify.route({
    url: '/',
    method: 'POST',
    schema: {
      ...createGqlResponseSchema,
      response: {
        200: gqlResponseSchema,
      },
    },
    async handler({ body: { query, variables } }) {
      return await graphql({
        variableValues: variables,
        contextValue: {
          prisma,
        },
        schema,
        source: query,
      });
    },
  });
};

export default plugin;
