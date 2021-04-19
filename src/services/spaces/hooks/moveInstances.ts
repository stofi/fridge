import { HookContext } from "@feathersjs/feathers";

interface Instance {
  _id: string;
}

const moveInstances = async (context: HookContext) => {
  context.app.services["spaces"]
    .find({
      query: {
        default: true,
        group: context.data.group,
        $select: ["_id"],
      },
      paginate: false,
    })
    .then(([defaultSpace]: Instance[]) =>
      context.app.services["instances"]
        .find({
          query: { space: context.result._id, $select: ["_id"] },
          paginate: false,
        })
        .then(async (instances: Instance[]) =>
          instances.reduce(async (prev: Promise<any>, curr: Instance) => {
            await prev;
            return context.app.services["instances"].patch(curr._id, {
              space: defaultSpace._id,
            });
          }, Promise.resolve())
        )
    )
    .catch(console.error);

  return context;
};

export default moveInstances;
