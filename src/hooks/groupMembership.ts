import { HookContext, Id } from '@feathersjs/feathers';
import { isClientOrWithUserAndNotForced } from './guards';
import {
  chechOwner,
  checkMember,
  findGroup,
  findInstance,
  findSpace,
} from './utils';
import { Group } from '../types';

const instanceOwnerOrMember = async (context: HookContext): Promise<Group> => {
  const [instance] = await findInstance(context.id as Id, context);
  if (!instance) throw new Error('No instance for this id');
  if (!instance.space)
    throw new Error('Trying to access an instance without a parent space');

  let group: any = instance.space.group;

  if (!group) {
    const space: any = instance.space;
    if (space.group) {
      group = space.group;
    } else {
      const [parentSpace] = await findSpace(space as Id, context);
      if (!parentSpace) throw new Error('No space for this id');
      group = parentSpace.group;
    }
  }
  const [parentGroup] = !group._id
    ? await findGroup(group as Id, context)
    : [group];

  if (!parentGroup) throw new Error('No group for this id');

  return parentGroup;
};

const spaceOwnerOrMember = async (context: HookContext): Promise<Group> => {
  const [space] = await findSpace(context.id as Id, context);
  if (!space) throw new Error('No space for this id');

  if (!space.group)
    throw new Error('Trying to access a space without a parent group');

  const group: any = space.group;
  const [parentGroup] = !group._id
    ? await findGroup(group as Id, context)
    : [group];

  if (!parentGroup) throw new Error('no group for this id');

  return parentGroup;
};

const groupOwnerOrMember = async (context: HookContext): Promise<Group> => {
  const [group] = await findGroup(context.id as Id, context);
  if (!group) throw new Error('No group for this id');

  return group;
};

const getGroup = async (context: HookContext): Promise<Group> => {
  if (context.path === 'instances') {
    return await instanceOwnerOrMember(context);
  }
  if (context.path === 'spaces') {
    return await spaceOwnerOrMember(context);
  }
  if (context.path === 'groups') {
    return await groupOwnerOrMember(context);
  }

  throw new Error('Can\'t find a group to check membership.');
};

export const isOwnerOrMember = async (
  context: HookContext
): Promise<HookContext> => {
  if (!isClientOrWithUserAndNotForced(context)) return context;
  if (!context.id && !context.path) return context;

  const approved = await getGroup(context)
    .then(
      (group) =>
        checkMember(context.params.user?._id, group.members) ||
        chechOwner(context.params.user?._id, group.owner)
    )
    .catch(() => false);

  if (approved) return context;

  throw new Error('User is not a member of the parent group of this resource');
};

export const isOwner = async (context: HookContext): Promise<HookContext> => {
  if (!isClientOrWithUserAndNotForced(context)) return context;
  if (!context.id && !context.path) return context;

  const approved = await getGroup(context)
    .then((group) => chechOwner(context.params.user?._id, group.owner))
    .catch(() => false);

  if (approved) return context;

  throw new Error('User is not a owner of the parent group of this resource');
};

export const isMember = async (context: HookContext): Promise<HookContext> => {
  if (!isClientOrWithUserAndNotForced(context)) return context;
  if (!context.id && !context.path) return context;

  const approved = await getGroup(context)
    .then((group) => checkMember(context.params.user?._id, group.members))
    .catch(() => false);

  if (approved) return context;
  throw new Error('User is not a member of the parent group of this resource');
};

export default isOwnerOrMember;
