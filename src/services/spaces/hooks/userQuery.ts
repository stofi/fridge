import { HookContext } from '@feathersjs/feathers';
import { isClientOrWithUser } from '../../../hooks/guards';
import { Group } from '../../../types/';

const userQuery = async (context: HookContext): Promise<HookContext> => {
  if (!isClientOrWithUser(context)) return context;
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

  context.params.query = context.params.query?.group
    ? context.params.query
    : {
      ...context.params.query,
      group: { $in: approved },
    };

  return context;
};

export default userQuery;
