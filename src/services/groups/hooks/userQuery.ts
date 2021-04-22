import { HookContext } from '@feathersjs/feathers';
import { isClientOrWithUser, isForced } from '../../../hooks/guards';

const userQuery = async (context: HookContext): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
  if (isForced(context)) return context;
  if (!context.params.query) return context;
  context.params.query = {
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
