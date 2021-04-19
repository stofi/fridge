import { HookContext, Id } from "@feathersjs/feathers";

interface User {
  _id: Id;
}

interface Group {
  _id: Id;
  owner: User;
  members: User[];
}
interface Space {
  _id: Id;
  group: Group;
}

const userQuery = async (context: HookContext) => {
  if (!context.params.user?._id) return context;
  const approved: Group[] = await context.app.services["groups"]
    .find({
      query: {
        $select: ["_id"],
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
    .catch(console.error);

  const spaces: Space[] = await context.app.services["spaces"]
    .find({
      query: {
        $select: ["_id"],
        group: { $in: approved },
      },
      paginate: false,
    })
    .then((spaces: Space[]) => spaces.map(({ _id }) => _id))
    .catch(console.error);

  const b = await context.app.services["spaces"]
    .find({
      query: {
        $select: ["_id", "group"],
      },
      paginate: false,
    })
    .then((spaces: Space[]) => spaces.map(({ _id }) => _id));

  context.params.query = {
    ...context.params.query,
    space: { $in: spaces },
  };

  return context;
};

export default userQuery;
