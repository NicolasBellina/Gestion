import { composeMongoose } from 'graphql-compose-mongoose';
import { schemaComposer } from 'graphql-compose';
import { User } from '../../models/User';
import { PostTC } from './PostTC';

interface IUserInput {
  name: string;
  email: string;
  avatar?: string;
}

export const UserTC = composeMongoose(User, {
  name: 'User',
  description: 'User type',
  fields: {
    avatar: 'String',
  },
  inputType: {
    removeFields: ['createdAt', 'updatedAt', 'password'],
  },
});

UserTC.addResolver({
  name: 'findMany',
  type: [UserTC],
  resolve: async () => {
    return User.find();
  }
});

UserTC.addResolver({
  name: 'findById',
  type: UserTC,
  args: { _id: 'MongoID!' },
  resolve: async ({ args }: { args: { _id: string } }) => {
    return User.findById(args._id);
  }
});

const UserInput = schemaComposer.createInputTC({
  name: 'UserInput',
  fields: {
    name: 'String!',
    email: 'String!',
    avatar: 'String'
  },
});

UserTC.addResolver({
  name: 'createOne',
  args: {
    input: UserInput
  },
  type: UserTC,
  resolve: async ({ args }: { args: { input: IUserInput } }) => {
    try {
      const user = new User(args.input);
      await user.save();
      return user;
    } catch (error) {
      console.error('Erreur lors de la création:', error);
      throw error;
    }
  }
});

UserTC.addResolver({
  name: 'updateById',
  type: UserTC,
  args: {
    _id: 'MongoID!',
    record: `input UpdateUserInput {
      name: String
      email: String
      avatar: String
    }`
  },
  resolve: async ({ args }: { args: { _id: string, record: Partial<IUserInput> } }) => {
    try {
      const updatedUser = await User.findByIdAndUpdate(
        args._id,
        { $set: args.record },
        { new: true, runValidators: true }
      );
      
      if (!updatedUser) {
        throw new Error('Utilisateur non trouvé');
      }
      
      return updatedUser;
    } catch (error) {
      console.error('Erreur lors de la mise à jour:', error);
      throw error;
    }
  }
});

UserTC.addResolver({
  name: 'removeById',
  type: UserTC,
  args: {
    _id: 'MongoID!'
  },
  resolve: async ({ args }: { args: { _id: string } }) => {
    try {
      const deletedUser = await User.findByIdAndDelete(args._id);
      if (!deletedUser) {
        throw new Error('Utilisateur non trouvé');
      }
      return deletedUser;
    } catch (error) {
      console.error('Erreur lors de la suppression:', error);
      throw error;
    }
  }
});

// Ajouter la relation avec les posts
UserTC.addRelation('posts', {
  resolver: () => PostTC.getResolver('findMany'),
  prepareArgs: {
    filter: (source: { _id: any; }) => ({
      authorId: source._id
    }),
  },
  projection: { _id: true }, // Assurez-vous que _id est disponible pour la relation
}); 