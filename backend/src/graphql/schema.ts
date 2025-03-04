import { schemaComposer } from 'graphql-compose';
import { UserTC } from './types/UserTC';
import { PostTC } from './types/PostTC';

// Queries
schemaComposer.Query.addFields({
  users: UserTC.getResolver('findMany'),
  user: UserTC.getResolver('findById'),
  posts: PostTC.getResolver('findMany'),
  post: PostTC.getResolver('findById')
});

// Mutations
schemaComposer.Mutation.addFields({
  // User mutations
  createUser: UserTC.getResolver('createOne'),
  updateUser: UserTC.getResolver('updateById'),
  removeUser: UserTC.getResolver('removeById'),

  // Post mutations
  createPost: PostTC.getResolver('createOne'),
  updatePost: PostTC.getResolver('updateById'),
  removePost: PostTC.getResolver('removeById'),
});

export const schema = schemaComposer.buildSchema(); 