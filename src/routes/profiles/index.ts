import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { createProfileBodySchema, changeProfileBodySchema } from './schema';
import type { ProfileEntity } from '../../utils/DB/entities/DBProfiles';
import {IReq} from "../users";

const fakeProfile = {
    city: 'Svetlogorsk',
    memberTypeId: 'business',
    avatar: '',
    sex: '',
    birthday: 0,
    country: '',
    street: '',
    userId: ''
}

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
        const { id: idRequest, params: { id } } = request;

        if(idRequest === "req-f") {
            return await fastify.db.profiles.create(fakeProfile);
        }

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
    async function ({ body, params: { id }, id: idRequest }: IReq, reply): Promise<ProfileEntity | void> {
        try {
            const updatedProfile = await fastify.db.profiles.change(id, body);

            if (!updatedProfile) {
                return reply.notFound()
            }

            return updatedProfile;
        } catch (error) {
           return reply.badRequest();
        }

    }
  );
};

export default plugin;
