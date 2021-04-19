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
  if (!context.params.user) return context;
  context.params.query = {
    ...context.params.query,
    $or: [
      { owner: context.params.user?._id },
      {
        members: context.params.user?._id,
      },
    ],
  };

  return context;
};

export default userQuery;
