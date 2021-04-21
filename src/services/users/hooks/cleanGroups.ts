import { HookContext } from '@feathersjs/feathers';

interface Group {
  _id: string;
}

const cleanGroups = async (context: HookContext): Promise<HookContext> => {
  context.app.services['groups']
    .find({
      query: { owner: context.result._id, $select: ['_id'] },
      paginate: false,
    })
    .then(async (groups: Group[]) => {
      groups.reduce(async (prev: Promise<any>, curr: Group) => {
        await prev;
        return context.app.services['groups'].remove(curr._id);
      }, Promise.resolve());
    })
    .catch((e: Error) => {
      throw e;
    });

  return context;
};

export default cleanGroups;
