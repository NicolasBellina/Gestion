import mongoose, { Document } from 'mongoose';

export interface IPost extends Document {
  title: string;
  content: string;
  authorId: mongoose.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Le titre est requis'],
    trim: true,
    minlength: [3, 'Le titre doit contenir au moins 3 caractères'],
    maxlength: [100, 'Le titre ne peut pas dépasser 100 caractères']
  },
  content: {
    type: String,
    required: [true, 'Le contenu est requis'],
    trim: true,
    minlength: [10, 'Le contenu doit contenir au moins 10 caractères']
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, "L'ID de l'auteur est requis"],
    index: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Index composé pour améliorer les performances des recherches
postSchema.index({ authorId: 1, createdAt: -1 });

// Virtual pour l'auteur
postSchema.virtual('author', {
  ref: 'User',
  localField: 'authorId',
  foreignField: '_id',
  justOne: true
});

// Middleware pre-save pour validation supplémentaire
postSchema.pre('save', async function(next) {
  if (this.isModified('authorId')) {
    const User = mongoose.model('User');
    const userExists = await User.exists({ _id: this.authorId });
    if (!userExists) {
      throw new Error("L'auteur spécifié n'existe pas");
    }
  }
  next();
});

// Méthode pour obtenir un extrait du contenu
postSchema.methods.getExcerpt = function(length = 150) {
  if (this.content.length <= length) return this.content;
  return this.content.substring(0, length) + '...';
};

export const Post = mongoose.model<IPost>('Post', postSchema); 