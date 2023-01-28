import { FastifyPluginAsyncJsonSchemaToTs } from '@fastify/type-provider-json-schema-to-ts';
import { idParamSchema } from '../../utils/reusedSchemas';
import {
  createUserBodySchema,
  changeUserBodySchema,
  subscribeBodySchema,
} from './schemas';
import type { UserEntity } from '../../utils/DB/entities/DBUsers';

export interface IReq {
    [key: string]: any;
}

const plugin: FastifyPluginAsyncJsonSchemaToTs = async (
  fastify
): Promise<void> => {
  fastify.get('/', async function (): Promise<UserEntity[]> {
      return await fastify.db.users.findMany();
  });

  fastify.get(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request:IReq, reply): Promise<UserEntity | void> {
        const { id } = request.params;
        const user = await fastify.db.users.findOne({key: "id", equals: id});

        if (!user) {
            return reply.notFound("not found user");
        }
        return user;
    }
  );

  fastify.post(
    '/',
    {
      schema: {
        body: createUserBodySchema,
      },
    },
    async function (request: IReq, reply): Promise<UserEntity | void> {
        const { body } = request
        const createdUser = await fastify.db.users.create(body);
        if(!createdUser) {
            return reply.badRequest()
        }

        return createdUser
    }
  );

  fastify.delete(
    '/:id',
    {
      schema: {
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<UserEntity | void> {
        try {
            const { id } = request.params;
            const user = await fastify.db.users.findOne({key: "id", equals: id})

            if (!user) {
                return reply.badRequest()
            }

            const users = await Promise.all(
                user.subscribedToUserIds.map((userId) => {
                    return fastify.db.users.findOne({
                        key: "id",
                        equals: userId,
                    });
                })
            );

            users.forEach((user) => {
                if (user) {
                    const userId = user.subscribedToUserIds.indexOf(id);

                    if (userId > -1) {
                        user.subscribedToUserIds.splice(userId, 1);
                    }
                }
            });

            await Promise.all(
                user.subscribedToUserIds.map((userId) => {
                    return fastify.db.users.change(userId, users.find((user) => user?.id === userId)!);
                })
            )

            const userProfile = await fastify.db.profiles.findOne({
                key: "userId",
                equals: id,
            })

            const posts = await fastify.db.posts.findMany({
                key: "userId",
                equals: id,
            })

            if (userProfile) {
                await fastify.db.profiles.delete(userProfile.id)
            }

            if (posts)
                await Promise.all(
                    posts.map((post) => {
                        return fastify.db.posts.delete(post.id)
                    })
                );

            const deletedUser = await fastify.db.users.delete(id)

            if (!deletedUser) {
                reply.badRequest()
            }
            return deletedUser
        } catch (error) {
            reply.badRequest();
        }
    }
  );

  fastify.post(
    '/:id/subscribeTo',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<UserEntity | void> {
        const { id } = request.params;
        const subscriber = await fastify.db.users.findOne({key: "id", equals: id})

        const { userId } = request.body

        const user = await fastify.db.users.findOne({
            key: 'id',
            equals: userId,
        });

        if (!subscriber || !user) {
            return reply.badRequest();
        }
        const followerIndex = subscriber.subscribedToUserIds.findIndex(
            (id) => id === userId
        );

        if (followerIndex !== -1) {
            return reply.badRequest();
        }

        const updatedSubscriber = await fastify.db.users.change(userId, {
            subscribedToUserIds: [
                ...user.subscribedToUserIds,
                subscriber.id,
            ],
        });

        const updatedUser = await fastify.db.users.change(id, {
            subscribedToUserIds: [
                ...subscriber.subscribedToUserIds,
                user.id,
            ],
        });

        if (!updatedSubscriber || !updatedUser) {
            return reply.badRequest();
        }

        return reply.status(200).send(updatedUser);
    }
  );

  fastify.post(
    '/:id/unsubscribeFrom',
    {
      schema: {
        body: subscribeBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<UserEntity | void> {
        const { id } = request.params;
        const unSubscriber = await fastify.db.users.findOne({key: "id", equals: id})

        const { userId } = request.body

        const user = await fastify.db.users.findOne({
            key: 'id',
            equals: userId,
        });

        if (!unSubscriber || !user) {
            return reply.badRequest();
        }

        const subscriberIndex = user.subscribedToUserIds.includes(id);

        if (!subscriberIndex) {
            return reply.badRequest()
        }

        const updatedSubscriber = await fastify.db.users.change(userId, {
            subscribedToUserIds: user.subscribedToUserIds.filter(
                (subscriberId) => subscriberId !== id
            ),
        });

        const updatedUser = await fastify.db.users.change(request.params.id, {
            subscribedToUserIds: unSubscriber.subscribedToUserIds.filter(
                (id) => id !== userId
            ),
        });

        if (!updatedSubscriber || !updatedUser) {
            return reply.badRequest();
        }

        return reply.send(updatedUser);
    }
  );

  fastify.patch(
    '/:id',
    {
      schema: {
        body: changeUserBodySchema,
        params: idParamSchema,
      },
    },
    async function (request: IReq, reply): Promise<UserEntity | void> {
        const { id } = request.params;

        const user = await fastify.db.users.findOne({key: "id", equals: id});

        if (!user) {
            return reply.badRequest();
        }

        const updatedUser = await fastify.db.users.change(id, request.body);

        if(!updatedUser) {
            return reply.badRequest()
        }
        return updatedUser;
    }
  );
};

export default plugin;
