import { HookContext } from '@feathersjs/feathers';

interface Instance {
  _id: string;
}

const moveInstances = async (context: HookContext) => {
  const [space] = await context.app.services['spaces'].find({
    query: {
      _id: context.id,
    },
    paginate: false,
  });
  context.app.services['spaces']
    .find({
      query: {
        default: true,
        group: space.group._id,
        $select: ['_id'],
      },
      paginate: false,
    })
    .then(([defaultSpace]: Instance[]) =>
      context.app.services['instances']
        .find({
          query: { space: context.id, $select: ['_id'] },
          paginate: false,
        })
        .then(async (instances: Instance[]) =>
          instances.reduce(async (prev: Promise<any>, curr: Instance) => {
            await prev;
            console.log(curr);

            return context.app.services['instances'].patch(curr._id, {
              default: false,
              space: defaultSpace._id,
            });
          }, Promise.resolve())
        )
    )
    .catch(console.error);

  return context;
};

export default moveInstances;
