import { graphql, parse, validate } from 'graphql';
import depthLimit from 'graphql-depth-limit';

import { FastifyPluginAsyncTypebox } from '@fastify/type-provider-typebox';

//schemas
import { createGqlResponseSchema, gqlResponseSchema, schema } from './schemas.js';

const plugin: FastifyPluginAsyncTypebox = async (fastify): Promise<void> => {
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
      const errors = validate(schema, parse(query), [depthLimit(5)]);

      if (errors?.length) {
        return { errors };
      }

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
