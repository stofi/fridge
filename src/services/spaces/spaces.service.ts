// Initializes the `spaces` service on path `/spaces`
import { ServiceAddons } from '@feathersjs/feathers';
import { Application } from '../../declarations';
import { Spaces } from './spaces.class';
import createModel from '../../models/spaces.model';
import hooks from './spaces.hooks';

// Add this service to the service type index
declare module '../../declarations' {
  interface ServiceTypes {
    'spaces': Spaces & ServiceAddons<any>;
  }
}

export default function (app: Application): void {
  const options = {
    Model: createModel(app),
    paginate: app.get('paginate')
  };

  // Initialize our service with any options it requires
  app.use('/spaces', new Spaces(options, app));

  // Get our initialized service so that we can register hooks
  const service = app.service('spaces');

  service.hooks(hooks);
}
