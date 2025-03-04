import { Document } from 'mongoose';

declare module 'graphql-compose-mongoose' {
  export function composeMongoose(model: any, opts?: any): any;
} 