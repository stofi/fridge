import { HookContext } from '@feathersjs/feathers';

const preventDefaultDelete = async (
  context: HookContext
): Promise<HookContext> => {
  if (context.params.force)  return context;
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
  if (space && space.default) {
    throw new Error('cannot delete default-space');
  }
  return context;
};

export default preventDefaultDelete;
