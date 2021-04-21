import { HookContext } from '@feathersjs/feathers';

interface Instance {
  _id: string;
}

const cleanInstances = async (context: HookContext): Promise<HookContext> => {
  context.app.services['instances']
    .find({
      query: { group: context.result._id, $select: ['_id'] },
      paginate: false,
    })
    .then(async (instances: Instance[]) => {
      instances.reduce(async (prev: Promise<any>, curr: Instance) => {
        await prev;
        return context.app.services['instances'].remove(curr._id);
      }, Promise.resolve());
    })

    .catch((e: Error) => {
      throw e;
    });

  return context;
};

export default cleanInstances;
