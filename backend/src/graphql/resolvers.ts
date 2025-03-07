import { create } from 'domain';
import { Post } from '../models/Post';
import { User } from '../models/User';

// Types temporaires pour la démonstration
interface Post {
  id: string;
  title: string;
  content: string;
  authorId: string;
  createdAt: string;
  updatedAt?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

// Stockage temporaire en mémoire
const posts: Post[] = [];
const users: User[] = [];

export const resolvers = {
  Query: {
    posts: async () => {
      return await Post.find().sort({ createdAt: -1 });
    },
    post: async (_: any, { id }: { id: string }) => {
      return await Post.findById(id);
    },
    users: async () => {
      return await User.find();
    },
    user: async (_: any, { id }: { id: string }) => {
      return await User.findById(id);
    }, 
  },

  Mutation: {
    createPost: async (_: any, { title, content, authorId }: { title: string; content: string; authorId: string }) => {
      const post = new Post({
        title,
        content,
        authorId
      });
      return await post.save();
    },

    updatePost: async (_: any, { id, title, content }: { id: string; title?: string; content?: string }) => {
      const post = await Post.findById(id);
      if (!post) throw new Error('Post not found');

      if (title) post.title = title;
      if (content) post.content = content;
      post.updatedAt = new Date();

      return await post.save();
    },

    deletePost: async (_: any, { id }: { id: string }) => {
      const result = await Post.deleteOne({ _id: id });
      return result.deletedCount === 1;
    },

    createUser: async (_: any, { name, email, avatar }: { name: string; email: string; avatar?: string }) => {
      const user = new User({
        name,
        email,
        avatar
      });
      return await user.save();
    }
  },

  Post: {
    author: async (post: any) => {
      return await User.findById(post.authorId);
    }
  },

  User: {
    posts: async (user: any) => {
      return await Post.find({ authorId: user._id });
    }
  }
}; 