import fastify from 'fastify';
import { schema } from './graphql/schema';
import { mercurius } from 'mercurius';
import cors from '@fastify/cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const app = fastify();

// Activation de CORS
app.register(cors, {
  origin: true,
  credentials: true
});

// Configuration GraphQL
app.register(mercurius, {
  schema,
  graphiql: true
});

// Connexion à MongoDB avec les bonnes options
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/blog';

mongoose.connect(MONGODB_URI, {
  serverSelectionTimeoutMS: 5000,
  socketTimeoutMS: 45000,
})
.then(() => {
  console.log('📦 Connecté à MongoDB');
})
.catch(err => {
  console.error('❌ Erreur de connexion MongoDB:', err);
  process.exit(1);
});

// Démarrage du serveur
const start = async () => {
  try {
    await app.listen({ port: 4000, host: '0.0.0.0' });
    console.log('🚀 Serveur démarré sur http://localhost:4000/graphql');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

start(); 