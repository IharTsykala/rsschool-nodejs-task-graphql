import {GraphQLID, GraphQLNonNull, GraphQLObjectType, GraphQLString} from "graphql";

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
    name: "mutation",
    fields: {
        createUser: {
            type: User,
            args: {
                body: {
                    type: new GraphQLNonNull(UserInput)
                }
            },
            description: "Create new user",
            resolve: function (parent, { body: { firstName, lastName, email } }, contextValue) {
                try {
                    return contextValue.db.users.create({ firstName, lastName, email });
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        createPost: {
            type: Post,
            description: "Create new post",
            args: {
                body: {
                    type: new GraphQLNonNull(PostInput)
                }
            },
            resolve: function (parent, { body }, contextValue) {
                try {
                return contextValue.db.posts.create(body);
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
                body: {
                    type: new GraphQLNonNull(UpdateUserInput)
                },
            },
            resolve: async (parent, { id, body }, contextValue) => {
                try {
                    return await contextValue.db.users.change(id, body);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        createProfile: {
            type: Profile,
            description: "Create new profile",
            args: {
                body: {
                    type: new GraphQLNonNull(ProfileInput)
                }
            },
            resolve: async function (parent, { body, body: { memberTypeId, userId } }, contextValue) {
                try{
                    const memberType = await contextValue.db.memberTypes.findOne({
                        key: "id",
                        equals: memberTypeId,
                    });

                    const profile = await contextValue.db.profiles.findOne({
                        key: "userId",
                        equals: userId,
                    });

                    let result

                    if (memberType && !profile) {
                        result = await contextValue.db.profiles.create(body);
                    }

                    return result
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
                body: {
                    type: new GraphQLNonNull(UpdateProfileInput)
                }
            },
            resolve: async (parent, { id, body }, contextValue) => {
                try {
                    return await contextValue.db.profiles.change(id, body);
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
                body: {
                    type: new GraphQLNonNull(UpdatePostInput)
                }
            },
            resolve: async (parent, { id, body }, contextValue) => {
                try {
                    return await contextValue.db.posts.change(id, body);
                } catch (err) {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },

        updateMemberType: {
            type: MemberTypes,
            description: "Update member type data",
            args: {
                id: { type: new GraphQLNonNull(GraphQLString) },
                body: {
                    type: new GraphQLNonNull(UpdateMemberInput)
                }
            },
            resolve: async (parent, { id, body }, contextValue) => {
                try {
                    return await contextValue.db.memberTypes.change(id, body);
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
                body: {
                    type: new GraphQLNonNull(SubscribeUserInput)
                }
            },
            resolve: async (parent, {id: userId, body: { idToSubscribe } }, contextValue) => {
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
                    return  contextValue.httpErrors.notFound()
                }

                if(user.subscribedToUserIds.includes(userToSubscribe.id)) {
                    return
                }

                await contextValue.db.users.change(user.id, {
                    subscribedToUserIds: [...user.subscribedToUserIds, userToSubscribe.id],
                });

                 await contextValue.db.users.change(userToSubscribe.id, {
                     subscribedToUserIds: [...userToSubscribe.subscribedToUserIds, user.id],
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
                body: {
                    type: new GraphQLNonNull(UnSubscribeUserInput)
                }
            },
            resolve: async (parent, {id: userId, body: { idToUnsubscribe } }, contextValue) => {
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
                        return contextValue.httpErrors.notFound();
                    }

                    if(!user.subscribedToUserIds.includes(userToUnSubscribe.id)) {
                        return
                    }

                    await contextValue.db.users.change(user.id, {
                        subscribedToUserIds:
                            user.subscribedToUserIds.filter((userId: typeof GraphQLID) =>
                                userId !== userToUnSubscribe.id),
                    });

                    await contextValue.db.users.change(userToUnSubscribe.id, {
                        subscribedToUserIds:
                            userToUnSubscribe.subscribedToUserIds.filter((userId: typeof GraphQLID) =>
                                userId !== user.id),
                    });

                    return user;
                } catch {
                    throw contextValue.httpErrors.badRequest();
                }
            },
        },
    },
});
