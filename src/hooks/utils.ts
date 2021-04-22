import { HookContext, Id } from '@feathersjs/feathers';

import { Instance, Space, Group, User } from '../types';

export const findInstance = async (
  id: Id,
  context: HookContext
): Promise<Instance[]> =>
  await context.app.services['instances']
    .find({
      query: {
        _id: id,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });

export const findSpace = async (id: Id, context: HookContext): Promise<Space[]> =>
  await context.app.services['spaces']
    .find({
      query: {
        _id: id,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });

export const findGroup = async (id: Id, context: HookContext): Promise<Group[]> =>
  await context.app.services['groups']
    .find({
      query: {
        _id: id,
      },
      paginate: false,
    })
    .catch((e: Error) => {
      throw e;
    });

export const checkMember = (id: Id, members: User[]): boolean =>
  !!members.find(({ _id }: User) => _id === id);

export const chechOwner = (id: Id, owner: User): boolean =>
  String(owner._id) === String(id);
