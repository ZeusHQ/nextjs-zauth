import { withPageAuthRequired, withApiAuthRequired } from '../src';

describe('index', () => {
  test('withPageAuthRequired should not create an SDK instance at build time', () => {
    const secret = process.env.ZIDENTITY_SECRET;
    delete process.env.ZIDENTITY_SECRET;
    expect(() => withApiAuthRequired(jest.fn())).toThrow('"secret" is required');
    expect(() => withPageAuthRequired()).not.toThrow();
    process.env.ZIDENTITY_SECRET = secret;
  });
});
