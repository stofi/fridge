import { HookContext, Id } from '@feathersjs/feathers';

interface User {
  _id: Id;
}

const isOwnerOrMember = async (context: HookContext): Promise<HookContext> => {
  if (context.params.force) return context;
  const [space] = await context.app.services['spaces']
    .find({
      query: {
        _id: context.id,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });

  if(!space) return context;

  if (space && !!space.group) return context;

  const [group] = await context.app.services['groups']
    .find({
      query: {
        _id: space ? space.group : context.data.group,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });

  const isDefaultSpace =
    (space && space.default) || (context.data && context.data.default);
  const isDefaultGroup = group && group.default;
  const isCreateMethod = context.method === 'create';

  if ((isDefaultSpace || isDefaultGroup) && isCreateMethod) return context;

  const isMember = !!group.members.find(
    ({ _id }: User) => _id === context.params.user?._id
  );
  const isOwner = String(group.owner._id) === String(context.params.user?._id);
  const isApproved = isOwner || isMember;

  if (!isApproved)
    throw new Error('User is not approved to add a space for this group');

  return context;
};

export default isOwnerOrMember;
