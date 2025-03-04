import mongoose, { Document } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  avatar: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  avatar: {
    type: String,
    trim: true
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

// Index pour optimiser les recherches
userSchema.index({ email: 1 });

// Virtuals
userSchema.virtual('posts', {
  ref: 'Post',
  localField: '_id',
  foreignField: 'authorId'
});

// Méthode pour obtenir le nombre de posts
userSchema.methods.getPostCount = async function() {
  return await mongoose.model('Post').countDocuments({ authorId: this._id });
};

export const UserModel = mongoose.model<IUser>('User', userSchema); 