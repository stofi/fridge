import { Application } from '../declarations';
import users from './users/users.service';
import groups from './groups/groups.service';
import products from './products/products.service';
import instances from './instances/instances.service';
import spaces from './spaces/spaces.service';
// Don't remove this comment. It's needed to format import lines nicely.

export default function (app: Application): void {
  app.configure(users);
  app.configure(groups);
  app.configure(products);
  app.configure(instances);
  app.configure(spaces);
}
