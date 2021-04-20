import { HookContext } from '@feathersjs/feathers';

const isOwner = async (context: HookContext) => {
  const [group] = await context.app.services['groups'].find({
    query: {
      _id: context.id,
    },
    paginate: false,
  });

  if (String(group.owner._id) !== String(context.params.user?._id))
    throw new Error('User is not the group owner');

  return context;
};

export default isOwner;
