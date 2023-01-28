import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createPostBodySchema, changePostBodySchema } from './schema';
import type { PostEntity } from '../../utils/DB/entities/DBPosts';
import {IReq} from "../users";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<PostEntity[]> {
      return await fastify.db.posts.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<PostEntity | void> {
        const { id } = request.params

        const post = await fastify.db.posts.findOne({key: "id", equals: id})

        if (!post) {
            return reply.notFound();
        }
        return post;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createPostBodySchema,
      },
    },
    async function (request: IReq, reply): Promise<PostEntity | void> {
        const { body, body: { userId } } = request

        const newPost = await fastify.db.posts.create(body);

        const user = await fastify.db.users.findOne({key: "id", equals: userId});

        if (!user) {
            return reply.badRequest()
        }

        return newPost;
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<PostEntity | void> {
        try {
            const { id } = request.params

            const deletedPost = await fastify.db.posts.delete(id);

            if (!deletedPost) {
                reply.notFound()
            }

            return deletedPost;
        } catch (error) {
            reply.badRequest();
        }
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changePostBodySchema,
        params: idParamSchema,
      },
    },
    async function (request:IReq, reply): Promise<PostEntity | void> {
        try {
            const { body, params: { id } } = request
            const updatedPost = await fastify.db.posts.change(id, body);

            return reply.send(updatedPost);
        } catch (error) {
            return reply.badRequest();
        }
    }
  );
};

export default plugin;
