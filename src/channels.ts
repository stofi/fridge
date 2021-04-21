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
    // On a new real-time connection, add it to the anonymous channel
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
      // Obtain the logged in user from the connection
      const user = connection.user;

      // The connection is no longer anonymous, remove it
      app.channel('anonymous').leave(connection);

      app.channel(`user/${user._id}`).join(connection);
      // Add it to the authenticated user channel
      app.channel('authenticated').join(connection);

      // Channels can be named anything and joined on any condition

      // E.g. to send real-time events only to admins use
      // if(user.isAdmin) { app.channel('admins').join(connection); }

      // If the user has joined e.g. chat rooms
      // if(Array.isArray(user.rooms)) user.rooms.forEach(room => app.channel(`rooms/${room.id}`).join(connection));

      // Easily organize users by email and userid for things like messaging
      // app.channel(`emails/${user.email}`).join(connection);
      // app.channel(`userIds/${user.id}`).join(connection);
    }
  });

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // app.publish((data: any, hook: HookContext) => {
  //   // Here you can add event publishers to channels set up in `channels.ts`
  //   // To publish only for a specific event use `app.publish(eventname, () => {})`
  //   console.log(
  //     'Publishing all events to all authenticated users. See `channels.ts` and https://docs.feathersjs.com/api/channels.html for more information.'
  //   ); // eslint-disable-line
  //   // e.g. to publish all service events to all authenticated users use
  //   return app.channel('authenticated');
  // });

  app
    .service('groups')
    .publish((data: any) => [
      app.channel(`user/${data.owner._id}`),
      ...data.members.forEach(({ _id }: User) => app.channel(`user/${_id}`)),
    ]);

  app
    .service('spaces')
    .publish((data: any) =>
      !!(data.group && data.group.owner)
        ? [
          app.channel(`user/${data.group.owner}`),
          ...data.group.members.forEach(({ _id }: User) =>
            app.channel(`user/${_id}`)
          ),
        ]
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
    return [
      app.channel(`user/${group.owner._id}`),
      ...group.members.forEach(({ _id }: User) => app.channel(`user/${_id}`)),
    ];
  });
  app.service('products').publish(() => app.channel('authenticated'));

  // Here you can also add service specific event publishers
  // e.g. the publish the `users` service `created` event to the `admins` channel
  // app.service('users').publish('created', () => app.channel('admins'));

  // With the userid and email organization from above you can easily select involved users
  // app.service('messages').publish(() => {
  //   return [
  //     app.channel(`userIds/${data.createdBy}`),
  //     app.channel(`emails/${data.recipientEmail}`)
  //   ];
  // });
}
