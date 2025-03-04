import { composeMongoose } from 'graphql-compose-mongoose';
import { Task } from '../../models/Task';
import { UserTC } from './UserTC';

export const TaskTC = composeMongoose(Task, {
  name: 'Task',
  description: 'Task type',
});

TaskTC.addRelation('user', {
  resolver: () => UserTC.getResolver('findById'),
  prepareArgs: {
    _id: (source: any) => source.userId,
  },
  projection: { userId: true },
});

TaskTC.addResolver({
  name: 'tasksByUser',
  type: [TaskTC],
  args: { userId: 'MongoID!' },
  resolve: async ({ args }: { args: { userId: string } }) => {
    return Task.find({ userId: args.userId }).sort({ startDate: 1 });
  }
}); 