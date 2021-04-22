import { HookContext } from '@feathersjs/feathers';
import { Group, Space } from '../../../types/';
import { isClientOrWithUser, isForced } from '../../../hooks/guards';

const userQuery = async (context: HookContext): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
  if (isForced(context)) return context;
  if (!context.params.query) return context;
  const approved: Group[] = await context.app.services['groups']
    .find({
      query: {
        $select: ['_id'],
        $or: [
          { owner: context.params.user?._id },
          {
            members: context.params.user?._id,
          },
        ],
      },
      paginate: false,
    })
    .then((groups: Group[]) => groups.map(({ _id }) => _id))

    .catch((e: Error) => {
      throw e;
    });

  const spaces: Space[] = await context.app.services['spaces']
    .find({
      query: {
        $select: ['_id'],
        group: { $in: approved },
      },
      paginate: false,
    })
    .then((spaces: Space[]) => spaces.map(({ _id }) => _id))

    .catch((e: Error) => {
      throw e;
    });

  context.params.query = {
    ...context.params.query,
    space: { $in: spaces },
  };

  return context;
};

export default userQuery;
