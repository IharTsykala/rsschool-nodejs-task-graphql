import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID, GraphQLString,
} from "graphql";

import { User, Profile, Post, MemberTypes } from '../../types';

export const query =  new GraphQLObjectType({
        name: 'query',
        fields: {
            users: {
                type: new GraphQLList(User),
                description: "Get all users",
                resolve: function(source, {}, contextValue) {
                    return contextValue.db.users.findMany();
                }
            },
            profiles: {
                type: new GraphQLList(Profile),
                description: "Get all profiles",
                resolve(source, {}, contextValue) {
                    return contextValue.db.profiles.findMany();
                }
            },
            posts: {
                type: new GraphQLList(Post),
                description: "Get all posts",
                resolve(source, {}, contextValue) {
                    return contextValue.db.posts.findMany();
                }
            },
            memberTypes: {
                type: new GraphQLList(MemberTypes),
                description: "Get all types",
                resolve(source, {}, contextValue) {
                    return contextValue.db.memberTypes.findMany();
                }
            },
            user: {
                type: User,
                description: "Get user by ID",
                args: { id: { type: GraphQLID}},
                async resolve(source, { id }, contextValue) {
                    const user = await contextValue.db.users.findOne( { key: 'id', equals: id });

                    if (!user) {
                        throw contextValue.httpErrors.notFound("User not found");
                    }

                    return user;
                }
            },
            profile: {
                type: Profile,
                description: "Get profile by ID",
                args: { id: { type: GraphQLID}},
                async resolve(source, { id }, contextValue) {
                    const profile = await contextValue.db.profiles.findOne({ key: 'id', equals: id });

                    if (!profile) {
                        throw contextValue.httpErrors.notFound("Profile not found");
                    }

                    return profile;
                },
            },
            post: {
                type: Post,
                description: "Get post by ID",
                args: { id: { type: GraphQLID}},
                async resolve(source, { id }, contextValue) {
                    const post = await contextValue.db.posts.findOne({ key: 'id', equals: id });

                    if (!post) {
                        throw contextValue.httpErrors.notFound("Post not found");
                    }

                    return post;
                },
            },
            memberType: {
                type: MemberTypes,
                description: "Get memberType by ID",
                args: { id: { type: GraphQLString } },
                async resolve(source, { id }, contextValue) {
                    const type = await contextValue.db.memberTypes.findOne({ key: 'id', equals: id });

                    if (!type) {
                        throw contextValue.httpErrors.notFound("Type not found");
                    }

                    return type;
                }
            },
        }
    }
)
