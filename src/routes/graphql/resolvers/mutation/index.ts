import { GraphQLID, GraphQLNonNull, GraphQLObjectType} from "graphql";

import {
    MemberTypes,
    Post,
    PostInput,
    Profile,
    ProfileInput,
    SubscribeUserInput,
    UnSubscribeUserInput,
    UpdateMemberInput,
    UpdatePostInput,
    UpdateProfileInput,
    UpdateUserInput,
    User,
    UserInput
} from "../../types";

export const mutation = new GraphQLObjectType({
    name: "Mutation",
    fields: {
        createUser: {
            type: User,
            args: {
                input: {
                    type: new GraphQLNonNull(UserInput)
                }
            },
            description: "Create new user",
            resolve: function (parent, { input: { firstName, lastName, email } }, contextValue) {
                try {
                    return contextValue.db.users.create({ firstName, lastName, email });
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        createProfile: {
            type: Profile,
            args: {
                input: {
                    type: new GraphQLNonNull(ProfileInput)
                }
            },
            resolve: async function (parent, { input, input: { memberTypeId, userId } }, contextValue) {
                const memberType = await contextValue.db.memberTypes.findOne({
                    key: "id",
                    equals: memberTypeId,
                });

                const profile = await contextValue.db.profiles.findOne({
                    key: "userId",
                    equals: userId,
                });
                try{
                    let result
                if (memberType && !profile) {
                    result = await contextValue.db.profiles.create(input);
                }
                return result
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        createPost: {
            type: Post,
            args: {
                input: {
                    type: new GraphQLNonNull(PostInput)
                }
            },
            resolve: function (parent, { input }, contextValue) {
                try {
                return contextValue.db.posts.create(input);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        updateUser: {
            type: User,
            description: "Update user data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: new GraphQLNonNull(UpdateUserInput)
                },
            },
            resolve: async (parent, { id, input }, contextValue) => {
                try {
                    return await contextValue.db.users.change(id, input);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        updateProfile: {
            type: Profile,
            description: "Update profile data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: new GraphQLNonNull(UpdateProfileInput)
                }
            },
            resolve: async (parent, { id, input }, contextValue) => {
                try {
                    return await contextValue.db.profiles.change(id, input);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        updatePost: {
            type: Post,
            description: "Update post data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: new GraphQLNonNull(UpdatePostInput)
                }
            },
            resolve: async (parent, { id, input }, contextValue) => {
                try {
                    return await contextValue.db.posts.change(id, input);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        updateMemberType: {
            type: MemberTypes,
            description: "Update member type data",
            args: {
                input: {
                    type: new GraphQLNonNull(UpdateMemberInput)
                }
            },
            resolve: async (parent, { id, input }, contextValue) => {
                try {
                    return await contextValue.db.memberTypes.change(id, input);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        subscribeToUserId: {
            type: User,
            description: "Subscribe to user by ID",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: new GraphQLNonNull(SubscribeUserInput)
                }
            },
            resolve: async (parent, {id: userId, input: { idToSubscribe } }, contextValue) => {
             try{
                const user = await contextValue.db.users.findOne({
                    key: "id",
                    equals: userId,
                });

                const userToSubscribe = await contextValue.db.users.findOne({
                    key: "id",
                    equals: idToSubscribe,
                });

                if (!user || !userToSubscribe) {
                    throw contextValue.httpErrors.notFound()
                }

                await contextValue.db.users.change(user.id, {
                    subscribedToUserIds: [...user.subscribedToUserIds, userToSubscribe.id],
                });

                return user;
                } catch {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        unsubscribeToUserId: {
            type: User,
            description: "Unsubscribe from user by ID",
            args: {
                id: { type: new GraphQLNonNull(GraphQLID) },
                input: {
                    type: new GraphQLNonNull(UnSubscribeUserInput)
                }
            },
            resolve: async (parent, {id: userId, input: { idToUnsubscribe } }, contextValue) => {
                try {
                    const user = await contextValue.db.users.findOne({
                        key: "id",
                        equals: userId,
                    });

                    const userToUnSubscribe = await contextValue.db.users.findOne({
                        key: "id",
                        equals: idToUnsubscribe,
                    });

                    if (!user || !userToUnSubscribe) {
                        throw contextValue.httpErrors.notFound();
                    }

                    await contextValue.db.users.change(user.id, {
                        subscribedToUserIds:
                            user.subscribedToUserIds.filter((userId: typeof GraphQLID) =>
                                userId !== userToUnSubscribe.id),
                    });

                    return user;
                } catch {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },
    },
});
