import { HookContext, Id } from '@feathersjs/feathers';

const preventDefaultDelete = async (context: HookContext) => {
  const [space] = await context.app.services['spaces'].find({
    query: {
      _id: context.id,
    },
    paginate: false,
  });
  if (space.default) {
    throw new Error('cannot delete default-space');
  }
  return context;
};

export default preventDefaultDelete;
