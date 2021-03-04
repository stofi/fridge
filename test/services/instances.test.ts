import app from '../../src/app';

describe('\'instances\' service', () => {
  it('registered the service', () => {
    const service = app.service('instances');
    expect(service).toBeTruthy();
  });
});
