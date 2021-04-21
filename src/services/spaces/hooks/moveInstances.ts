import { HookContext } from '@feathersjs/feathers';

interface Instance {
  _id: string;
}

const moveInstances = async (context: HookContext): Promise<HookContext> => {
  const [space] = await context.app.services['spaces'].find({
    query: {
      _id: context.id,
    },
    paginate: false,
  });

  if (context.params.force) {
    context.app.services['instances']
      .find({
        query: { space: context.id, $select: ['_id'] },
        paginate: false,
      })
      .then(async (instances: Instance[]) =>
        instances.reduce(async (prev: Promise<any>, curr: Instance) => {
          await prev;
          return context.app.services['instances'].remove(curr._id, {
            force: false,
          });
        }, Promise.resolve())
      );

    return context;
  }

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
            return context.app.services['instances'].patch(curr._id, {
              default: false,
              space: defaultSpace._id,
            });
          }, Promise.resolve())
        )
    )

    .catch((e: Error) => {
      throw e;
    });

  return context;
};

export default moveInstances;
