import { composeMongoose } from 'graphql-compose-mongoose';
import { Post } from '../../models/Post';
import { UserTC } from './UserTC';
import mongoose, { Document, Types } from 'mongoose';

interface IPost {
  title: string;
  content: string;
  authorId: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

interface IPostInput {
  title: string;
  content: string;
  authorId: string;
}

export const PostTC = composeMongoose(Post, {
  name: 'Post',
  description: 'Post type with author relation',
});

PostTC.addResolver({
  name: 'findMany',
  type: [PostTC],
  resolve: async () => {
    return await Post.find().populate('author');
  }
});

PostTC.addResolver({
  name: 'findById',
  type: PostTC,
  args: { _id: 'MongoID!' },
  resolve: async ({ args }: { args: { _id: string } }) => {
    try {
      const post = await Post.findById(args._id).populate('author');
      if (!post) {
        throw new Error('Post not found');
      }
      return post;
    } catch (error) {
      console.error('Error fetching post:', error);
      throw error;
    }
  }
});

PostTC.addResolver({
  name: 'createOne',
  type: PostTC,
  args: {
    title: 'String!',
    content: 'String!',
    author: 'MongoID!'
  },
  resolve: async ({ args }: { args: { title: string, content: string, author: string } }) => {
    try {
      const post = new Post({
        title: args.title,
        content: args.content,
        authorId: args.author
      });
      
      const savedPost = await post.save();
      
      // Vérifier si le post a été sauvegardé correctement
      if (!savedPost) {
        throw new Error('Échec de la création du post');
      }
      
      // Retourner le post avec l'auteur peuplé
      return await Post.findById(savedPost._id).populate('author');
    } catch (error) {
      console.error('Erreur lors de la création du post:', error);
      
      // Gérer les erreurs de validation Mongoose
      if (error instanceof mongoose.Error.ValidationError) {
        const messages = Object.values(error.errors)
          .map((err: any) => err.message)
          .join(', ');
        throw new Error(`Erreur de validation: ${messages}`);
      }
      // Autres types d'erreurs
      throw new Error((error as Error).message || 'Erreur lors de la création du post');
    }
  }
});

PostTC.addResolver({
  name: 'updateById',
  type: PostTC,
  args: {
    _id: 'MongoID!',
    record: 'JSON!'
  },
  resolve: async ({ args }: { args: { _id: string, record: Partial<IPostInput> } }) => {
    return Post.findByIdAndUpdate(args._id, args.record, { new: true });
  }
});

PostTC.addResolver({
  name: 'removeById',
  type: PostTC,
  args: {
    _id: 'MongoID!'
  },
  resolve: async ({ args }: { args: { _id: string } }) => {
    return Post.findByIdAndDelete(args._id);
  }
});

// Relation avec l'auteur
PostTC.addRelation('author', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source: IPost) => source.authorId,
  },
  projection: { authorId: true },
});

// Définir le type d'entrée pour la création d'un post
PostTC.addFields({
  author: {
    type: 'User',
    resolve: (source: { author: any; }) => source.author,
  },
});