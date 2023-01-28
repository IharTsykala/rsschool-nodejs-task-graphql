import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import {IReq} from "../users";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<
    ProfileEntity[]
  > {
      return await fastify.db.profiles.findMany()
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<ProfileEntity | void> {
        const { id } = request.params;

        const profile = await fastify.db.profiles.findOne({key: "id", equals: id});
        if (!profile) {
            return reply.notFound()
        }
        return profile;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createProfileBodySchema,
      },
    },
    async function (request: IReq, reply): Promise<ProfileEntity | void> {

        const { body, body: { memberTypeId } } = request

        const profileMemberTypeId = await fastify.db.profiles.findOne({key: "memberTypeId", equals: memberTypeId});

        if (!profileMemberTypeId) {
            return reply.badRequest();
        }

        return await fastify.db.profiles.create(body);
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<ProfileEntity | void> {
        const { id } = request.params;

        const userProfile = await fastify.db.profiles.findOne({key: "id", equals: id});

        if (!userProfile) {
            return reply.badRequest();
        }

        const deletedProfile = await fastify.db.profiles.delete(id);

        if (!deletedProfile) {
            return reply.notFound()
        }

        return deletedProfile;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeProfileBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<ProfileEntity | void> {
        try {

            if(request.params.id === "undefined") {
                return reply.badRequest()
            }

            const userProfile = await fastify.db.profiles.change(request.body.id, request.body);
            if (!userProfile) {
                reply.badRequest();
            }
            return userProfile;
        } catch (error) {
            reply.badRequest();
        }

    }
  );
};

export default plugin;
