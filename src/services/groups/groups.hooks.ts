import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import addDefaultSpace from './hooks/addDefaultSpace';
import addOwner from './hooks/addOwner';
import userQuery from './hooks/userQuery';
import preventDefaultDelete from './hooks/preventDefaultDelete';
import { fastJoin } from 'feathers-hooks-common';
import { HookContext } from '@feathersjs/feathers';

import { isOwner } from '../../hooks/groupMembership';

import cleanSpaces from './hooks/cleanSpaces';

const { authenticate } = authentication.hooks;

const resolvers = {
  joins: {
    members: () => async (group: any, { app }: HookContext) => {
      if (!group.members) return;
      group.members = await app.services['users']
        .find({
          query: {
            _id: { $in: group.members },
          },
          paginate: false,
        })
        .catch(() => []);
    },
    owner: () => async (group: any, { app }: HookContext) => {
      if (!group.owner) return;
      group.owner = await app.services['users']
        .get(group.owner)
        .catch(() => null);
    },
  },
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [userQuery],
    get: [userQuery],
    create: [addOwner],
    update: [isOwner],
    patch: [isOwner],
    remove: [preventDefaultDelete, isOwner, cleanSpaces],
  },

  after: {
    all: [fastJoin(resolvers)],
    find: [],
    get: [],
    create: [addDefaultSpace],
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
