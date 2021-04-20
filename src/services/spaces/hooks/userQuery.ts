import { HookContext } from "@feathersjs/feathers";

interface User {
  _id: String;
}

interface Group {
  _id: String;
  owner: User;
  members: User[];
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

  context.params.query = {
    ...context.params.query,
    group: { $in: approved },
  };

  return context;
};

export default userQuery;