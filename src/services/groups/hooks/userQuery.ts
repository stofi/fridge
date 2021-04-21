import { HookContext } from '@feathersjs/feathers';

const userQuery = async (context: HookContext): Promise<HookContext> => {
  if (!context.params.user) return context;
  context.params.query = {
    ...context.params.query,
    $or: [
      { owner: context.params.user?._id },
      {
        members: context.params.user?._id,
      },
    ],
  };

  return context;
};

export default userQuery;
