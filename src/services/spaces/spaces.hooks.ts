import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import { fastJoin } from 'feathers-hooks-common';
import preventDefaultDelete from './hooks/preventDefaultDelete';
import moveInstances from './hooks/moveInstances';
import userQuery from './hooks/userQuery';
import isOwnerOrMember from '../../hooks/groupMembership';
const { authenticate } = authentication.hooks;
import { HookContext } from '@feathersjs/feathers';

const resolvers = {
  joins: {
    group: () => async (space: any, { app }: HookContext) => {
      if (!space.group) return;
      space.group = await app.services['groups']
        .get(space.group)
        .catch(() => null);
    },
  },
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [userQuery],
    get: [userQuery],
    create: [isOwnerOrMember],
    update: [isOwnerOrMember],
    patch: [isOwnerOrMember],
    remove: [isOwnerOrMember, preventDefaultDelete, moveInstances],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },

  error: {
    all: [],
    find: [],
    get: [],
    create: [],
    update: [],
    patch: [],
    remove: [],
  },
};
