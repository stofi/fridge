import '@feathersjs/transport-commons';
import { HookContext, Id } from '@feathersjs/feathers';
import { Application } from './declarations';

interface User {
  _id: Id;
}

export default function (app: Application): void {
  if (typeof app.channel !== 'function') {
    // If no real-time functionality has been configured just return
    return;
  }

  app.on('connection', (connection: any): void => {
    app.channel('anonymous').join(connection);
  });
  app.on('logout', (payload: any, { connection }: any) => {
    if (connection) {
      //When logging out, leave all channels before joining anonymous channel
      app.channel(app.channels).leave(connection);
      app.channel('anonymous').join(connection);
    }
  });
  app.on('login', (authResult: any, { connection }: any): void => {
    // connection can be undefined if there is no
    // real-time connection, e.g. when logging in via REST
    if (connection) {
      const user = connection.user;

      app.channel('anonymous').leave(connection);

      app.channel(`user/${user._id}`).join(connection);
      app.channel('authenticated').join(connection);

    }
  });

  // 1. Service publisher for a specific event
  // 2. Service publisher for all events
  // 3. App publishers for a specific event
  // 4. App publishers for all events

  
  app.publish(() => app.channel('authenticated'));

  app
    .service('groups')
    .publish((data: any) =>
      app.channel(
        app.channels.filter(
          (channel) =>
            channel.match(`user/${data.owner._id}`) ||
            data.members.some(({ _id }: User) => channel.match(`user/${_id}`))
        )
      )
    );

  app
    .service('spaces')
    .publish((data: any) =>
      !!(data.group && data.group.owner)
        ? app.channel(
          app.channels.filter(
            (channel) =>
              channel.match(`user/${data.group.owner}`) ||
                data.group.members.some(({ _id }: User) =>
                  channel.match(`user/${_id}`)
                )
          )
        )
        : app.channel('authenticated')
    );

  app.service('instances').publish(async (data: any, context: HookContext) => {
    if (!data.space) return app.channel('authenticated');
    if (!data.space.group) return app.channel('authenticated');

    const [group] = await context.app.services['groups']
      .find({
        query: {
          _id: data.space.group,
        },
        paginate: false,
      })
      .catch((e: Error) => {
        throw e;
      });

    if (!group) return app.channel('authenticated');
    return app.channel(
      app.channels.filter(
        (channel) =>
          channel.match(`user/${group.owner._id}`) ||
          group.members.some(({ _id }: User) => channel.match(`user/${_id}`))
      )
    );
  });
}
