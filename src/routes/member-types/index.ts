import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import { changeMemberTypeBodySchema } from './schema';
import type { MemberTypeEntity } from '../../utils/DB/entities/DBMemberTypes';
import {IReq} from "../users";

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<
    MemberTypeEntity[]
  > {
      return await fastify.db.memberTypes.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<MemberTypeEntity | void> {
        const { id } = request.params

        const memberType = await fastify.db.memberTypes.findOne({key: "id", equals: id});

        if (!memberType) {
            return reply.notFound()
        }

        return memberType;
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeMemberTypeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<MemberTypeEntity | void> {
        const { body, params: { id } } = request

        const memberType = await fastify.db.memberTypes.findOne({key: "id", equals: id});

        if (!memberType) {
            return reply.badRequest()
        }

        const updatedMemberType = await fastify.db.memberTypes.change(id, body);

        if (!updatedMemberType) {
            return reply.badRequest()
        }
        return updatedMemberType;
    }
  );
};

export default plugin;
