import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLID,
    GraphQLInt, GraphQLNonNull, GraphQLInputObjectType,
} from "graphql";

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
        monthPostsLimit: { type: GraphQLString },
    },
});

export const User = new GraphQLObjectType({
    name: "User",
    fields: {
        id: { type: GraphQLID },
        firstName: { type: GraphQLString },
        lastName: { type: GraphQLString },
        email: { type: GraphQLString },
        subscribedToUserIds: { type: new GraphQLList(GraphQLString) },
        profile: {
            type: Profile,
            resolve(parent, args, contextValue) {
                return contextValue.db.profiles.findOne({
                    key: "id",
                    equals: parent.id,
                });
            },
        },
        posts: {
            type: new GraphQLList(Post),
            resolve(parent, args, contextValue) {
                return contextValue.db.posts.findOne({
                    key: "id",
                    equals: parent.id,
                });
            },
        },
        memberTypes: {
            type: MemberTypes,
            resolve(parent, args, contextValue) {
                return contextValue.db.memberTypes.findOne({
                    key: "id",
                    equals: parent.id,
                });
            },
        }
    },
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
        email: { type: GraphQLString },
        subscribedToUserIds: {
            type: new GraphQLList(GraphQLString)
        },
    },
});


export const UpdatePostInput = new GraphQLInputObjectType({
    name: "UpdatePostInput",
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        title: { type: GraphQLString },
        content: { type: GraphQLString },
    },
});

export const UpdateMemberInput = new GraphQLInputObjectType({
    name: "UpdateMemberInput",
    fields: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        discount: { type: GraphQLInt },
        monthPostsLimit: { type: GraphQLInt },
    },
});

export const SubscribeUserInput = new GraphQLInputObjectType({
    name: "SubscribeUserInput",
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        SubscriberId: { type: new GraphQLNonNull(GraphQLString) },
    },
});

export const UnSubscribeUserInput = new GraphQLInputObjectType({
    name: "UnSubscribeUserInput",
    fields: {
        userId: { type: new GraphQLNonNull(GraphQLString) },
        UnSubscriberId: { type: new GraphQLNonNull(GraphQLString) },
    },
});
