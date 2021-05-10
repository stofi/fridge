import * as authentication from '@feathersjs/authentication';
// Don't remove this comment. It's needed to format import lines nicely.
import { fastJoin } from 'feathers-hooks-common';
import userQuery from './hooks/userQuery';
import { HookContext } from '@feathersjs/feathers';

import isOwnerOrMember from '../../hooks/groupMembership';

const { authenticate } = authentication.hooks;

const resolvers = {
  joins: {
    product: () => async (instance: any, { app }: HookContext) => {
      if (!instance.product) return;
      instance.product = await app.services['products']
        .get(instance.product)
        .catch(() => null);
    },
    space: () => async (instance: any, { app }: HookContext) => {
      if (!instance.space) return;
      instance.space = await app.services['spaces']
        .get(instance.space)
        .catch(() => null);
    },
  },
};

export default {
  before: {
    all: [authenticate('jwt')],
    find: [userQuery],
    get: [userQuery],
    create: [],
    update: [isOwnerOrMember],
    patch: [isOwnerOrMember],
    remove: [isOwnerOrMember],
  },

  after: {
    all: [
      fastJoin(resolvers)
    ],
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
