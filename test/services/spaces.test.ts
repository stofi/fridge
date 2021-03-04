import app from '../../src/app';

describe('\'spaces\' service', () => {
  it('registered the service', () => {
    const service = app.service('spaces');
    expect(service).toBeTruthy();
  });
});
