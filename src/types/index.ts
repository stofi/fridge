import { Id } from '@feathersjs/feathers';

export interface User {
  _id: Id;
}

export interface Group {
  _id: Id;
  owner: User;
  members: User[];
  default: boolean;
}
export interface Space {
  _id: Id;
  group: Group;
  default: boolean;
}
export interface Instance {
  _id: Id;
  space: Space;
}
