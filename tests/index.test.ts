import { withPageAuthRequired, withApiAuthRequired } from '../src';

describe('index', () => {
  test('withPageAuthRequired should not create an SDK instance at build time', () => {
    const secret = process.env.ZAUTH_SECRET;
    delete process.env.ZAUTH_SECRET;
    expect(() => withApiAuthRequired(jest.fn())).toThrow('"secret" is required');
    expect(() => withPageAuthRequired()).not.toThrow();
    process.env.ZAUTH_SECRET = secret;
  });
});
