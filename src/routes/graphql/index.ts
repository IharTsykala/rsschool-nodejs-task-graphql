import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { graphqlBodySchema } from './schema';
import {IReq} from "../users";
import {graphql, GraphQLSchema, parse, validate} from "graphql";
import {query} from "./resolvers/query";
import { mutation } from "./resolvers/mutation";
import * as depthLimit from 'graphql-depth-limit';

const DEPTH = 6;

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

        const errors = validate(schema, parse(String(query)), [
            depthLimit(DEPTH),
        ]);

        if (errors.length > 0) {
            reply.send({ data: null, errors: errors });

            return;
        }

        return await graphql({ schema, source, contextValue: fastify});
    }
  );
};

export default plugin;
