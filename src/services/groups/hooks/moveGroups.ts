import { HookContext } from "@feathersjs/feathers";

interface Group {
  _id: string;
}

const moveSpaces = async (context: HookContext) => {
  context.app.services["groups"]
    .find({
      query: {
        default: true,
        owner: context.data.owner,
        $select: ["_id"],
      },
      paginate: false,
    })
    .then(([defaultGroup]: Group[]) =>
      context.app.services["spaces"]
        .find({
          query: { group: context.result._id, $select: ["_id"] },
          paginate: false,
        })
        .then(async (spaces: Group[]) =>
          spaces.reduce(async (prev: Promise<any>, curr: Group) => {
            await prev;
            return context.app.services["spaces"].patch(curr._id, {
              group: defaultGroup._id,
            });
          }, Promise.resolve())
        )
    )
    .catch(console.error);

  return context;
};

export default moveSpaces;
