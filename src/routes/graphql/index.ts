import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {IReq} from "../users";
import {graphql, GraphQLSchema} from "graphql";
import {query} from "./resolvers/query";
import { mutation } from "./resolvers/mutation";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.post(
    '/',
    {
      schema: {
        body: graphqlBodySchema,
      },
    },
    async function (request: IReq, reply) {
        const source = String(request.body.query);
        const schema = new GraphQLSchema({ query, mutation });
        return await graphql({ schema, source, contextValue: fastify});
    }
  );
};

export default plugin;
