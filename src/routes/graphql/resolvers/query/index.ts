import {
    GraphQLObjectType,
    GraphQLList,
    GraphQLID,
} from "graphql";

import { User, Profile, Post, MemberTypes } from '../../types';

export const query =  new GraphQLObjectType({
        name: 'RootQueryType',
        fields: {
            users: {
                type: new GraphQLList(User),
                description: "Get all users",
                resolve: function(parent, args, contextValue) {
                    return contextValue.db.users.findMany();
                }
            },
            profiles: {
                type: new GraphQLList(Profile),
                description: "Get all profiles",
                resolve(parent, args, contextValue) {
                    return contextValue.db.profiles.findMany();
                }
            },
            posts: {
                type: new GraphQLList(Post),
                description: "Get all posts",
                resolve(parent, args, contextValue) {
                    return contextValue.db.posts.findMany();
                }
            },
            memberTypes: {
                type: new GraphQLList(MemberTypes),
                description: "Get all types",
                resolve(parent, args, contextValue) {
                    return contextValue.db.memberTypes.findMany();
                }
            },
            user: {
                type: User,
                description: "Get user by ID",
                args: { id: { type: GraphQLID}},
                async resolve(parent, args, contextValue) {
                    const user = await contextValue.db.users.findOne(args.id);
                    if (!user) {
                        throw contextValue.httpErrors.notFound("User not found");
                    }
                    return user;
                }
            },
            profile: {
                type: Profile,
                args: { id: { type: GraphQLID}},
                async resolve(parent, args, contextValue) {
                    const profile = await contextValue.db.profiles.findOne(args.id);
                    if (!profile) {
                        throw contextValue.httpErrors.notFound("Profile not found");
                    }
                    return profile;
                },
            },
            post: {
                type: Post,
                args: { id: { type: GraphQLID}},
                async resolve(parent, args, contextValue) {
                    const post = await contextValue.db.post.findOne(args.id);
                    if (!post) {
                        throw contextValue.httpErrors.notFound("Post not found");
                    }
                    return post;
                },
            },
            memberType: {
                type: MemberTypes,
                args: { id: { type: GraphQLID}},
                async resolve(parent, args, contextValue) {
                    const type = await contextValue.db.post.findOne(args.id);
                    if (!type) {
                        throw contextValue.httpErrors.notFound("Type not found");
                    }
                    return type;
                }
            },
        }
    }
)
