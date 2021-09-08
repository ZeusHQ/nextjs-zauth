import { BaseConfig, NextConfig, getConfig } from '../src/config';

const getConfigWithEnv = (env: any = {}, opts?: any): { baseConfig: BaseConfig; nextConfig: NextConfig } => {
  const bkp = process.env;
  process.env = {
    ...process.env,
    ...{
      ZIDENTITY_SECRET: '__long_super_secret_secret__',
      ZIDENTITY_ISSUER_BASE_URL: 'http://zeus.us.zidentity.local:3001',
      ZIDENTITY_BASE_URL: 'http://localhost:3001',
      ZIDENTITY_CLIENT_ID: '__test_client_id__',
      ZIDENTITY_CLIENT_SECRET: '__test_client_secret__'
    },
    ...env
  };
  try {
    return getConfig(opts);
  } catch (e) {
    throw e;
  } finally {
    process.env = bkp;
  }
};

describe('config params', () => {
  test('should return an object from empty defaults', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv();
    expect(baseConfig).toStrictEqual({
      secret: '__long_super_secret_secret__',
      issuerBaseURL: 'http://zeus.us.zidentity.local:3001',
      baseURL: 'http://localhost:3001',
      clientID: '__test_client_id__',
      clientSecret: '__test_client_secret__',
      clockTolerance: 60,
      httpTimeout: 5000,
      enableTelemetry: true,
      idpLogout: true,
      zIdentityLogout: true,
      idTokenSigningAlg: 'RS256',
      legacySameSiteCookie: true,
      authorizationParams: {
        response_type: 'code',
        audience: undefined,
        scope: 'openid profile email'
      },
      session: {
        name: 'appSession',
        rolling: true,
        rollingDuration: 86400,
        absoluteDuration: 604800,
        cookie: {
          domain: undefined,
          path: '/',
          transient: false,
          httpOnly: true,
          secure: true,
          sameSite: 'lax'
        }
      },
      routes: { callback: '/api/auth/callback', postLogoutRedirect: '' },
      getLoginState: expect.any(Function),
      identityClaimFilter: [
        'aud',
        'iss',
        'iat',
        'exp',
        'nbf',
        'nonce',
        'azp',
        'auth_time',
        's_hash',
        'at_hash',
        'c_hash'
      ],
      clientAuthMethod: 'client_secret_basic'
    });
    expect(nextConfig).toStrictEqual({
      identityClaimFilter: [
        'aud',
        'iss',
        'iat',
        'exp',
        'nbf',
        'nonce',
        'azp',
        'auth_time',
        's_hash',
        'at_hash',
        'c_hash'
      ],
      routes: {
        login: '/api/auth/login',
        callback: '/api/auth/callback',
        postLogoutRedirect: ''
      },
      organization: undefined
    });
  });

  test('should populate booleans', () => {
    expect(
      getConfigWithEnv({
        ZIDENTITY_ENABLE_TELEMETRY: 'off',
        ZIDENTITY_LEGACY_SAME_SITE_COOKIE: '0',
        ZIDENTITY_IDP_LOGOUT: 'no',
        ZIDENTITY_COOKIE_TRANSIENT: true,
        ZIDENTITY_COOKIE_HTTP_ONLY: 'on',
        ZIDENTITY_COOKIE_SAME_SITE: 'lax',
        ZIDENTITY_COOKIE_SECURE: 'ok',
        ZIDENTITY_SESSION_ABSOLUTE_DURATION: 'no'
      }).baseConfig
    ).toMatchObject({
      zIdentityLogout: false,
      enableTelemetry: false,
      idpLogout: false,
      legacySameSiteCookie: false,
      session: {
        absoluteDuration: false,
        cookie: {
          httpOnly: true,
          sameSite: 'lax',
          secure: true,
          transient: true
        }
      }
    });
  });

  test('should populate numbers', () => {
    expect(
      getConfigWithEnv({
        ZIDENTITY_CLOCK_TOLERANCE: '100',
        ZIDENTITY_HTTP_TIMEOUT: '9999',
        ZIDENTITY_SESSION_ROLLING_DURATION: '0',
        ZIDENTITY_SESSION_ABSOLUTE_DURATION: '1'
      }).baseConfig
    ).toMatchObject({
      clockTolerance: 100,
      httpTimeout: 9999,
      session: {
        rolling: true,
        rollingDuration: 0,
        absoluteDuration: 1
      }
    });
  });

  test('passed in arguments should take precedence', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv(
      {
        ZIDENTITY_ORGANIZATION: 'foo'
      },
      {
        authorizationParams: {
          audience: 'foo',
          scope: 'openid bar'
        },
        baseURL: 'https://baz.com',
        routes: {
          callback: 'qux'
        },
        session: {
          absoluteDuration: 100,
          cookie: {
            transient: false
          },
          name: 'quuuux'
        },
        organization: 'bar'
      }
    );
    expect(baseConfig).toMatchObject({
      authorizationParams: {
        audience: 'foo',
        scope: 'openid bar'
      },
      baseURL: 'https://baz.com',
      routes: {
        callback: 'qux'
      },
      session: {
        absoluteDuration: 100,
        cookie: {
          transient: false
        },
        name: 'quuuux'
      }
    });
    expect(nextConfig).toMatchObject({
      organization: 'bar'
    });
  });

  test('should allow hostnames as baseURL', () => {
    expect(
      getConfigWithEnv({
        ZIDENTITY_BASE_URL: 'foo.us.zidentity.io'
      }).baseConfig
    ).toMatchObject({
      baseURL: 'https://foo.us.zidentity.io'
    });
  });

  test('should accept optional callback path', () => {
    const { baseConfig, nextConfig } = getConfigWithEnv({
      ZIDENTITY_CALLBACK: '/api/custom-callback'
    });
    expect(baseConfig).toMatchObject({
      routes: expect.objectContaining({ callback: '/api/custom-callback' })
    });
    expect(nextConfig).toMatchObject({
      routes: expect.objectContaining({ callback: '/api/custom-callback' })
    });
  });
});
