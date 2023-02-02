import {
    GraphQLID,
    GraphQLInputObjectType,
    GraphQLInt,
    GraphQLList,
    GraphQLNonNull,
    GraphQLObjectType,
    GraphQLString,
} from "graphql";
import {PostEntity} from "../../../utils/DB/entities/DBPosts";

export const Profile = new GraphQLObjectType({
    name: "Profile",
    fields: {
        id: { type: GraphQLID },
        avatar: { type: GraphQLString },
        sex: { type: GraphQLString },
        birthday: { type: GraphQLString },
        country: { type: GraphQLString },
        street: { type: GraphQLString },
        city: { type: GraphQLString },
        memberTypeId: { type: GraphQLString },
        userId: { type: GraphQLString },
    },
});

export const Post = new GraphQLObjectType({
    name: "Post",
    fields: {
        id: { type: GraphQLID },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
        userId: { type: GraphQLID },
    },
});

export const MemberTypes = new GraphQLObjectType({
    name: "MemberTypes",
    fields: {
        id: { type: GraphQLString },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    },
});

// @ts-ignore
export const User = new GraphQLObjectType({
    name: "User",
    fields: () => ({
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
        subscribedToUser: {
            type: new GraphQLList(User),
            async resolve ({ subscribedToUserIds }, args, contextValue) {
                return await contextValue.db.users.findMany({
                    key: 'id',
                    equalsAnyOf: subscribedToUserIds,
                });
            },
        },
        userSubscribedTo: {
            type: new GraphQLList(User),
            async resolve ({ subscribedToUserIds }, args, contextValue) {
                return await contextValue.loaders.users.loadMany(subscribedToUserIds);
            },
        },
        profile: {
            type: Profile,
            resolve({ id }, args, contextValue) {
                return contextValue.db.profiles.findOne({
                    key: "id",
                    equals: id,
                });
            },
        },
        posts: {
            type: new GraphQLList(Post),
            async resolve({ id }, args, contextValue) {
                const posts = await contextValue.db.posts.findMany();
                return posts.filter((post: PostEntity) => post.userId === id);
            },
        },
        memberTypes: {
            type: MemberTypes,
            async resolve({ id }, args, contextValue) {
                const profile = await contextValue.db.profiles.findOne({key:'userId', equals: id});

                if(!profile) {
                    return
                }

                return await contextValue.db.memberTypes.findOne({
                    key: "id",
                    equals: profile.memberTypeId,
                });
            },
        },
    }),
});

export const UserInput = new GraphQLInputObjectType({
    name: "UserInput",
    fields: {
        firstName: { type: new GraphQLNonNull(GraphQLString) },
        lastName: { type: new GraphQLNonNull(GraphQLString) },
        email: { type: new GraphQLNonNull(GraphQLString) },
    }
})

export const ProfileInput = new GraphQLInputObjectType({
    name: "ProfileInput",
    fields: {
        avatar: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: new GraphQLNonNull(GraphQLID) },
    }
})

export const UpdateProfileInput = new GraphQLInputObjectType({
    name: "UpdateProfileInput",
    fields: {
        avatar: { type: new GraphQLNonNull(GraphQLString) },
        sex: { type: new GraphQLNonNull(GraphQLString) },
        birthday: { type: new GraphQLNonNull(GraphQLString) },
        country: { type: new GraphQLNonNull(GraphQLString) },
        street: { type: new GraphQLNonNull(GraphQLString) },
        city: { type: new GraphQLNonNull(GraphQLString) },
        memberTypeId: { type: new GraphQLNonNull(GraphQLString)},
        userId: { type: GraphQLID },
    }
})

export const PostInput = new GraphQLInputObjectType({
    name: "PostInput",
    fields: {
        title: { type: new GraphQLNonNull(GraphQLString) },
        content: { type: new GraphQLNonNull(GraphQLString) },
        userId: { type: new GraphQLNonNull(GraphQLID) },
    },
});

export const UpdateUserInput = new GraphQLInputObjectType({
    name: "UpdateUserInput",
    fields: {
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString }
    },
});


export const UpdatePostInput = new GraphQLInputObjectType({
    name: "UpdatePostInput",
    fields: {
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    },
});

export const UpdateMemberInput = new GraphQLInputObjectType({
    name: "UpdateMemberInput",
    fields: {
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    },
});

export const SubscribeUserInput = new GraphQLInputObjectType({
    name: "SubscribeUserInput",
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const UnSubscribeUserInput = new GraphQLInputObjectType({
    name: "UnSubscribeUserInput",
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
    },
});
